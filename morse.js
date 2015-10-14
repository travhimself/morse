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

morseapp.get('/receive', function (req, res) {
    res.sendFile('receive.html', fileoptions);
});


// start server
var server = morseapp.listen(s.nodeport, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on port %s...', port);
});


// establish socket connection
io.on('connection', function (socket) {

    // listen for broadcast...
    socket.on('transmit', function (data) {
        // confirm broadcast
        socket.emit('confirmtransmission');

        // forward signal on to receivers
        // by default the emit would go back to the sender; with broadcast flag we emit to everyone except the sender
        socket.broadcast.emit('forward', data);
    });

});
