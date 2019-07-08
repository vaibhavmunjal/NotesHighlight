$(function() {

  /* Global variables*/
  let allEndRange = [];
  let allStartRange = [];
  let contextMenuActive = "context-menu--active";
  let menuState = 0;
  let menu = $("#context-menu");

  /**************************************************************************
  ***************************************************************************
  ********
  ******** GET ALL START AND END RANGE.
  ********
  **************************************************************************
  **************************************************************************/
  getNotes();
  /**
  * set the highlight text and comments.
  * @param {arrayObject} allNotes The data to modify in the section.
  */
  function setHighlight(allNotes) {
    let highlightedData;
    let completeData = $("section").html();

    for (i=0; i<1; i++) {
    // for (i=0; i<allNotes.length; i++) {
      range = allNotes[i].content_range.split(":");
      startRange = range[0];
      endRange = range[1];
		if (!allStartRange.includes(startRange) && !allEndRange.includes(startRange)) {
			allStartRange.push(startRange);
		}
		if (!allStartRange.includes(endRange) && !allEndRange.includes(endRange)) {
			allEndRange.push(endRange);
		}
    highlightedData = `<span class="highlight">${allNotes[i].content}</span>`;
    // add note
    if (allNotes[i].notes != null || allNotes[i].notes != '') {
        highlightedData += `<span class="highlight-note" contenteditable="true">${allNotes[i].notes}</span>`;
    }
    completeData = (completeData.substr(0, startRange) +
                    highlightedData +
                    completeData.substr(endRange, completeData.length));
    }
    $("section").html(completeData);
    }

    // get all notes
    function getNotes() {
        $.ajax({
            type: 'GET',
            url: '/notes/',
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                setHighlight(data);
                restartEvent();
            }
        });
        return false;
    };


  /**************************************************************************
  ***************************************************************************
  ********
  ******** CONTEXT-MENU
  ********
  **************************************************************************
  **************************************************************************/

  /**
  * Turns the custom context menu on.
  */
  function toggleMenuOn(status) {
    if (menuState !== 1) {
      menuState = 1;
      menu.addClass(contextMenuActive);
    }
    if (status === 0) {
      menu.find(".add").css("display", "none");
      menu.find(".delete").css("display", "none");
      menu.find("main-menu").css("display", "block");
    }
    else if (status === 1) {
      menu.find(".add").css("display", "block");
      menu.find(".delete").css("display", "block");
      menu.find(".main-menu").css("display", "none");
    }
  };

  /**
  * Turns the custom context menu off.
  */
  function toggleMenuOff() {
    if (menuState !== 0) {
      menuState = 0;
      menu.removeClass(contextMenuActive);
    }
  }

  /**
   * Get x and y coordinates
   * @param {Object} e The event
   */
  function getPosition(e) {
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy };
    }

  $("section").contextmenu(function(e) {
    if (e) {
      e.preventDefault();
      toggleMenuOn(0);
    } else {
      toggleMenuOff();
    }
    positionMenu(e);
  });



  /**
   * Positions the menu properly.
   * @param {Object} e The event
  */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.outerWidth() + 4;
    menuHeight = menu.outerHeight() + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if (windowWidth - clickCoordsX < menuWidth) {
      menu.css("left", windowWidth - menuWidth + "px");
    } else {
      menu.css("left", clickCoordsX + "px");
    }
    if (windowHeight - clickCoordsY < menuHeight) {
      menu.css("top", windowHeight - menuHeight + "px");
    } else {
      menu.css("top", clickCoordsY + "px");
    }
  }

  $('html').click(function() {
    toggleMenuOff();
  });

  // Call init.
  $(".action").on("click", function() {
    let data = $(this).data("action");
    if (data === 'delete')
      console.log('delete the highlight span and note span');
    else if (data === 'addNote')
      console.log('add the note');
    else if (data === 'highlight')
      init(false);
    else if (data === 'note')
      init(true);
  });


  /**************************************************************************
   **************************************************************************
   ********
   ******** CREATE-HIGHLIGHT DATA, ADD NOTE
   ********
   **************************************************************************
   **************************************************************************/

  /**
  * Function to check whether the selected text follow the limit or not
  * @param {String} isNote Use to define whether note should be added or not
  */
  function init(isNote) {
    let txtRange = window.getSelection().toString();
    if (txtRange.length > 1) {
      doHighlight(isNote);
      }
  }

  /**
  * Function to add new highlight or note
  * @param {boolean} isNote Use to define whether note should be added or not
  */
  function doHighlight(isNote) {
    let start = end = 0;
    let sectionData, data, selectedTxt, noteTag;
    let content, contentRange;
    if (typeof window.getSelection != "undefined") {
        selectedTxt = window.getSelection().getRangeAt(0);
        let newElement = document.createElement("span");
        newElement.classList.add("make-highlight");

        try {
          selectedTxt.surroundContents(newElement);
        }
        catch {
          alert("Select only one section\nOR\nAvoid overriding of text to highlight.");
          return false;
        }

        data = $("section").clone(true, true);
        data.find(".highlight").contents().unwrap();
        data.find(".highlight-note").remove(".highlight-note");
        // data.find(".highlight-note").not(".highlight-note");
        sectionData = data.html();
        start = (sectionData.substr(0, sectionData.indexOf('<span class="make-highlight">'))).length;
        content = data.find(".make-highlight").html();
        end = start + content.length;
        contentRange = `${start}:${end}`;

        if (allStartRange.includes(start) || allStartRange.includes(end) ||
            allEndRange.includes(start) || allEndRange.includes(end)) {
              alert("please don't override the text");
              return false;
            }
        // Add neighbour/sibiling element for note.
        let domData = $("section");
		if (isNote) {
    noteTag = $("<span contenteditable=\"true\">")
                .addClass("highlight-note")
                // .css("background-color", "red")
                .data("range", contentRange)
                .html("Add note here");
		noteTag.insertAfter(domData.find(".make-highlight"));
    }

		domData.find(".make-highlight")
                    .addClass("highlight")
                    .removeClass("make-highlight")
                    .data("range", contentRange);
    console.log(contentRange);


    createNote(content, contentRange, 'Add Note');
		if (!allStartRange.includes(startRange)) {
			allStartRange.push(startRange);
		}
		if (!allEndRange.includes(endRange)) {
			allEndRange.push(endRange);
    }
    restartEvent();
    console.log($("section").html());
    }
    return {
        start: start,
        end: end
    };
  }

    /**
     *  Add new note.
     *
     * @param {String} content The data to be replaced in section.
     * @param {String} range The start:end position of the replacing text.
     * @param {String} note The comment to add.
    */
    function createNote(content, range, note) {
        $.ajax({
            type: 'POST',
            url: '/new/',
            data: {
                content: content,
                contentRange: range,
                note: note,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                alert("got data");
                // call each function here

                console.log(data);
            }
        });
        return false;
    };

// Update the selected/changed note
  function updateNote() {
    $.ajax({
      type: 'POST',
      url: '/update/',
      data: {
        contentRange: $(this).data("range"), // pass range here
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
        success: function(data) {
        console.log(data);
        }
      });
    return false;
  };



    /**
     *  Delete the existing Note and highlight text.
     *
     * @param {textData} range The start:end position of the replacing text.
     */
    function remove(range) {
        $.ajax({
            type: 'POST',
            url: '/delete/',
            data: {
                contentRange: range,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                alert("got data");
                console.log(data);
            }
        });
        return false;
    };

  function CallbackEvent() {
    // let e = window.event;
    // e.preventDefault();
    // $("section span.highlight").contextmenu(function() {
    //   toggleMenuOn(1);
    //   positionMenu(e);
    // });
    console.log($(this).text());
    // alert($(this).text());
  }

  function restartEvent() {
    $(".highlight").off("contextmenu", CallbackEvent);
    $(".highlight").on("contextmenu", CallbackEvent);
    $(".highlight-note").off("focusout", updateNote);
    $(".highlight-note").on("focusout", updateNote);
  }


  // shortcut-Keys to create notes/ highlight text.
  // $("section").keydown(function(e) {
    // e.preventDefault();
    // if (e.ctrlKey && e.shiftKey && e.which == 72) {
      // init(false);
    // }
    // else if (e.ctrlKey && e.shiftKey && e.which == 65) {
      // init(true);
    // }
    // });

  // $(".highlight-note").each(function() {
    // set save button or on-focus out here
    // let element = $(this);
    // let txtRange = element.find(".note-range")
    // if (txtRange != 'empty') {
  // call ajax here to update or delete the note.
  //   }
  // });

});
