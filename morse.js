// settings
var s = {
    nodeport: 3000,
    ioport: 1111,
    viewspath: __dirname + '/views/'
};


// include express and start app
var express = require('express');
var morseapp = express();
var morseserver = require('http').Server(morseapp);
var io = require('socket.io')(morseserver).listen(s.ioport);
var crypto = require('crypto');


// set directory for static files with express.static middleware
morseapp.use(express.static('static'));


// routes
var fileoptions = {
    root: s.viewspath,
    dotfiles: 'ignore'
};

morseapp.get('/', function (req, res) {
    res.sendFile('index.html', fileoptions);
});

morseapp.get('/transmit', function (req, res) {
    res.sendFile('transmit.html', fileoptions);
});

morseapp.get('/receive/*', function (req, res) {
    res.sendFile('receive.html', fileoptions);
});


// middleware to catch 404s
morseapp.use(function(req, res) {
    res.sendFile('404.html', fileoptions);
});


// start server
var server = morseapp.listen(s.nodeport, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on port %s...', port);
});


// start object to hold channel information
var channels = {};


// establish socket connection
io.on('connection', function (socket) {

    // listen for new channel request (by transmitter)...
    socket.on('startchannel', function (data) {
        // generate credentials
        var newchannelid = crypto.randomBytes(4).toString('hex');
        var newchanneltransmissionkey = crypto.randomBytes(8).toString('hex');

        // add credentials to channel info object
        channels[newchannelid] = newchanneltransmissionkey;

        // send credentials to the transmitter
        var credentials = {
            'channelid': newchannelid,
            'channeltransmissionkey': newchanneltransmissionkey
        };

        socket.emit('confirmchannel', credentials);
    });

    // listen for transmission (by transmitter)...
    socket.on('transmit', function (data) {

        // confirm the sender has provided proper credentials
        if ( channels[data.channelid] === data.channeltransmissionkey ) {
            // confirm broadcast
            socket.emit('confirmtransmission');

            // forward signal on to receivers
            // by default the emit would go back to the sender; with broadcast flag we emit to everyone except the sender
            socket.broadcast.to(data.channelid).emit('forward', data.signal);
        }
    });

    // listen for joinchannel request (by receiver)...
    socket.on('joinchannel', function (data) {

        // confirm the channel exists, or send an error
        if ( channels[data] != undefined ) {
            socket.join(data);
        } else {
            socket.emit('nonexistentchannel');
        }
    });

});
