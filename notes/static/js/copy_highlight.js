$(function() {

    /**************************************************************************
     ***************************************************************************
     ********
     ******** CONTEXT-MENU
     ********
     **************************************************************************
    **************************************************************************/
  
    var contextMenuActive = "context-menu--active";
    var menuState = 0;
    var menu = document.querySelector("#context-menu");
  
    /**
    * Turns the custom context menu on.
    */
    function toggleMenuOn() {
      if (menuState !== 1) {
        menuState = 1;
        menu.classList.add(contextMenuActive);
      }
    }
  
    /**
    * Turns the custom context menu off.
    */
    function toggleMenuOff() {
      if (menuState !== 0) {
        menuState = 0;
        menu.classList.remove(contextMenuActive);
      }
    }
  
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
          toggleMenuOn();
          positionMenu(e);
        } else {
          toggleMenuOff();
        }
        positionMenu(e);
      })
  
    /**
     * Positions the menu properly.
     *
     * @param {Object} e The event
     */
    function positionMenu(e) {
      clickCoords = getPosition(e);
      clickCoordsX = clickCoords.x;
      clickCoordsY = clickCoords.y;
  
      menuWidth = menu.offsetWidth + 4;
      menuHeight = menu.offsetHeight + 4;
  
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
  
      if (windowWidth - clickCoordsX < menuWidth) {
        menu.style.left = windowWidth - menuWidth + "px";
      } else {
        menu.style.left = clickCoordsX + "px";
      }
  
      if (windowHeight - clickCoordsY < menuHeight) {
        menu.style.top = windowHeight - menuHeight + "px";
      } else {
        menu.style.top = clickCoordsY + "px";
      }
    }
  
    $('html').click(function() {
      toggleMenuOff();
    });
  
    $(".action").each(function() {
      let element = $(this);
      let action = element.data("action");
      element.on("click", function() {
        init(action);
      });
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
        let element = document.querySelector("section");
        let txtRange = Highlight(element, isNote);
        console.log(txtRange);
    }
    }
  
    /**
     * Function to add new highlight or note
     * @param {HtmlContent} element Data(tag+text) inside the Section tag
     * @param {String} isNote Use to define whether note should be added or not
     */
    function Highlight(element, isNote) {
      let start = end = 0;
      let selectedTxt, dataBeforeSelection;
      if (typeof window.getSelection != "undefined") {
        selectedTxt = window.getSelection().getRangeAt(0);
          let newElement = document.createElement("span");
          let sectionData = '';
          let data = '';
          newElement.classList.add("not-highlight");
  
          try {
          selectedTxt.surroundContents(newElement);
          data = $("section").clone();
          data.find(".highlight").contents().unwrap();
          data.find(".highlight-note").remove(".hightlight-note");
          sectionData = data.html();
          }
          catch {
            alert("Select only one section\nOR\nAvoid overriding of text to highlight.");
          }
          console.log(sectionData.substr(0, sectionData.indexOf('<span class="not-highlight"')));
          start = (sectionData.substr(0, sectionData.indexOf('<span class="not-highlight"'))).length;
          console.log(start);
          end = start + selectedTxt.toString().length;
          data.find(".not-highlight").remove(".not-highlight");
          console.log(`${start}    ${end}`);
      }
      return {
          start: start,
          end: end
      };
    }
  
  
    // shortcut-Keys to create notes/ highlight text.
    $("section").keydown(function(e) {
      e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.which == 72) {
        init(false);
      }
      else if (e.ctrlKey && e.shiftKey && e.which == 65) {
        init(true);
      }
      });
  
    $(".highlight-note").each(function() {
      // set save button or on-focus out here
      let element = $(this);
      let txtRange = element.find(".note-range")
      if (txtRange != 'empty') {
    // call ajax here to update or delete the note.
      }
    });
  
  
  });
  