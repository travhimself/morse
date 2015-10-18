$(document).ready(function() {

    // start new transmission
    var newtransmissionbutton = $('button.newtransmission');
    newtransmissionbutton.on('click', function(e) {
        window.location.pathname = '/transmit';
    });


    // join existing transmission
    var jointransmissionidinput = $('input.transmissionid');
    var jointransmissionbutton = $('button.jointransmission');
    jointransmissionbutton.on('click', function(e) {
        window.location.pathname = '/receive/' + jointransmissionidinput.val();
    });

});
