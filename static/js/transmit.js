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
                sendsignal('break');
                break;
            case 73:
                // i
                sendsignal('dot');
                break;
            case 79:
                // o
                sendsignal('dash');
                break;
            case 8:
                // del
                sendsignal('delete');
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
        sendsignal('break');
    });

    buttondot.on('click', function (e) {
        sendsignal('dot');
    });

    buttondash.on('click', function (e) {
        sendsignal('dash');
    });

    buttondelete.on('click', function (e) {
        sendsignal('delete');
    });


    // append to input pane, collect string, and emit to server
    var $inputpane = $('section.input .inputstream');

    var sendsignal = function(signal) {
        if ( signal === 'delete' ) {
            $('i:last', $inputpane).remove();
        } else {
            $inputpane.append('<i data-key="' + signal + '">' + signal + '</i>');
        }

        var transmission = {
            'signal': signal,
            'channelid': credentials.channelid,
            'channeltransmissionkey': credentials.channeltransmissionkey
        };

        socket.emit('transmit', transmission);
    };

    socket.on('confirmtransmission', function() {
        console.log('success: transmission received by server');
    });

});
