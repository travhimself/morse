$(document).ready(function() {

    // prep socket
    var socket = io('http://localhost:1111');


    // listen for transmissions and append to output pane
    var outputpane = $('section.output .outputstream');

    socket.on('forward', function (data) {
        outputpane.html(data);
    });

});
