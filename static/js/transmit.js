$(document).ready(function() {

    // prep socket
    var socket = io('http://localhost:1111');


    // handle key presses
    $('body').keydown( function(e) {

        if (e.which === 32 || e.which === 73 || e.which === 79 || e.which === 8) {
            e.preventDefault();
        }

        switch (e.which) {
            case 32:
                // space bar
                sendkey('break', ' ');
                break;
            case 73:
                // i
                sendkey('dot', '.');
                break;
            case 79:
                // o
                sendkey('dash', '_');
                break;
            case 8:
                // del
                sendkey('delete', '');
                break;
            default:
                // any other key
        }
    });


    // append to input pane, collect string, and emit to server
    var inputpane = $('section.input .inputstream');
    var inputstring = '';

    var sendkey = function(key, signal) {
        if ( key === 'delete' ) {
            $('i:last', inputpane).remove();
        } else {
            inputpane.append('<i data-key="' + key + '">' + signal + '</i>');
        }
        inputstring = inputpane.html();
        socket.emit('transmit', inputstring);
    };

    socket.on('confirmtransmission', function() {
        console.log('transmission received by server');
    });

});
