// get index by:-
                //  find method,
                //  index of
                //  charAt
                //  Use any appropriate method as method("<span data-highlight=\"notSet\">") == initial/startRange
                //                                                                         endRange = startRange +
                //                                                                                     Text.len
                // In all the method the text to find is inside the $("section").html()

$(function() {

    function deleteHighlight() {
    $(".highlight").each(function() {
        let element = $(this);
        let capture = element.data('num');
        element.on("click", function() {
            element.contents().unwrap();
            // dataLink.replaceWith(dataLink.text());
            alert(capture);
        });
    });
    }


    /**
     * set the highlight text and comments.
     *
     * @param {arrayObject} allNotes The data to modify in the section.
     */
    function setHighlight(allNotes) {
    let completeData = $("section").html();
    console.log(completeData);
    let changedData = '';
    let highlightedData = '';
    // for (i=0; i<1; i++) {
    for (i=0; i<allNotes.length; i++) {
        range = allNotes[i].content_range.split(":");
        startRange = range[0];
        endRange = range[1];

        console.log(range);
        let newElement = document.createElement("span");
        newElement.classList.add("highlight")
        newElement.innerHTML = allNotes[i].content;
        highlightedData = `<span class="highlight">${allNotes[i].content}</span>`;
        // highlightedData = newElement;
        if (allNotes[i].notes != null || allNotes[i].notes != '') {
            let newNoteElement = document.createElement("span");
            newNoteElement.classList.add("highlight-note");
            newElement.innerHTML = allNotes[i].notes;
            // highlightedData += newNoteElement;
            highlightedData += `<span class="highlight-note">${allNotes[i].notes}</span>`;
        }

        completeData = (completeData.substr(0, startRange) +
                        highlightedData +
                        completeData.substr(endRange, completeData.length));
        $("section").html(completeData);
        console.log("data====");
        console.log($("section").html());

        // changedData = (highlightedData + ' ' +
        //                completeData.substr(endRange, completeData.length) + ' ' +
        //                changedData);
        // completeData = completeData.substr(0, startRange);
    }
    console.log(completeData);
    // changedData = completeData + ' ' + changedData;
    $("section").html(changedData);
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
                // here set the highlight text in body
                // setHighlight function here
                alert("got data");
                // console.log(data);
                // console.log(data.length);
                // for(i=0; i<data.length; i++) {
                //     console.log(data[i].content)
                //     console.log(data[i].content_range)
                // }
            }
        });
        return false;
    };
    getNotes();


    /**
     *  Add new note.
     *
     * @param {textData} content The data to be replaced in section.
     * @param {textData} range The start:end position of the replacing text.
     * @param {textData} note The comment to add.
     */
    function createNote(content, range, note) {
        $.ajax({
            type: 'POST',
            url: '/new/',
            data: {
                content: content,
                contentRange: range, // pass range here
                note: note,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                alert("got data");
                // call each function here
                getNotes();
                console.log(data);
            }
        });
        return false;
    };


    // Delete the highlighted background.
    $(".highlight").each(function() {
        let element = $(this);
        let range = element.find('.getData');
        element.on("click", remove(range));
    });


    /**
     *  Delete the existing Note and highlight text.
     *
     * @param {textData} content The data to be replaced in section.
     * @param {textData} range The start:end position of the replacing text.
     * @param {textData} note The comment to add.
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


    // Update the selected/changed note
    $("highlight-note").focusout(function() {
        $.ajax({
            type: 'POST',
            url: '/update/',
            data: {
                contentRange: '', // pass range here
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                alert("got data");
                console.log(data);
            }
        });
        return false;
    });

});
