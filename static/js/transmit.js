$(document).ready(function() {

    // prep socket
    var socket = io('http://localhost:1111');


    // establish a channel
    var credentials = {};

    socket.emit('startchannel');

    socket.on('confirmchannel', function(data) {
        // set credentials
        credentials.channelid = data.channelid;
        credentials.channeltransmissionkey = data.channeltransmissionkey;

        // set id in header
        var $channelidcontainer = $('header h1 .channelid');
        $channelidcontainer.text(credentials.channelid);

        // display url for sharing
        var $shareurlcontainer = $('section.aux .url');
        $shareurlcontainer.text(window.location.host + '/receive/' + credentials.channelid);
    });


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


    // handle button presses
    var buttonbreak = $('section.keys .keyblock .key[data-value=break]');
    var buttondot = $('section.keys .keyblock .key[data-value=dot]');
    var buttondash = $('section.keys .keyblock .key[data-value=dash]');
    var buttondelete = $('section.keys .keyblock .key[data-value=delete]');

    buttonbreak.on('click', function (e) {
        sendkey('break', ' ');
    });

    buttondot.on('click', function (e) {
        sendkey('dot', ' ');
    });

    buttondash.on('click', function (e) {
        sendkey('dash', ' ');
    });

    buttondelete.on('click', function (e) {
        sendkey('delete', ' ');
    });


    // append to input pane, collect string, and emit to server
    var $inputpane = $('section.input .inputstream');
    var inputstring = '';

    var sendkey = function(key, signal) {
        if ( key === 'delete' ) {
            $('i:last', $inputpane).remove();
        } else {
            $inputpane.append('<i data-key="' + key + '">' + signal + '</i>');
        }

        inputstring = $inputpane.html();

        var transmission = {
            'inputstring': inputstring,
            'channelid': credentials.channelid,
            'channeltransmissionkey': credentials.channeltransmissionkey
        };

        socket.emit('transmit', transmission);
    };

    socket.on('confirmtransmission', function() {
        console.log('success: transmission received by server');
    });

});
