$(document).ready(function() {

    // prep socket
    var socket = io('http://localhost:1111');


    // set channel to listen on
    var urlsegments = window.location.pathname.split('/');
    var channelid = urlsegments[2];

    var channelidcontainer = $('header h1 .channelid');
    channelidcontainer.text(channelid);

    socket.emit('joinchannel', channelid);


    // warn if channel does not exist
    socket.on('nonexistentchannel', function () {
        $outputpane.text('Unable to join channel.');
        console.log('error: channel does not exist');
    });


    // listen for transmissions and append to output pane
    var $outputpane = $('section.output .outputstream');

    socket.on('forward', function (data) {
        if ( data === 'delete' ) {
            $('i:last', $outputpane).remove();
        } else {
            $outputpane.append('<i data-key="' + data + '">' + data + '</i>');
        }
    });

});
