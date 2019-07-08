'use strict'

$(function() {

function deleteData() {
$(".highlight").each(function() {
let element = $(this);
let dataRange = element.data(range);
element.on("click", function() {
    modify(dataRange, 'url-delete', '');
    element.contents().unwrap();
    // call ajax here to delete from db. by providing the range.
});
});

$(".highlight-notes").each(function() {
let element = $(this);
let textRange = element.data("update-note");
let data = element.text();
element.focusout(function() {
    // call ajax here for update the note
    modify(textRange, 'url-update', data);

});
});


// Delete the data - text-highlight, note
function modify(textRange, url, note) {
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            textRange = textRange,
            note = note,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function(data) {
            alert("got data");
            console.log(data);
        }
    });
    return false;
};
};
});
