var socket = io();


socket.on('connect', function () {
    console.log('connected');

    // socket.emit('createMessage',{
    //     to:"brian",
    //     text:"socket"
    // });

});

socket.on('disconnect', function () {
    console.log('disconnect');
});

socket.on('newMessage', function (message) {
    console.log("new email", message);
    var li = document.createElement('ion-item');
    li.textContent =message.from +': '+ message.text;

    document.getElementById('receivedmsg').appendChild(li);
});

document.getElementById('chatform').addEventListener('submit', (e) => {
    e.preventDefault();

    message = document.getElementById('msg').value;
    if (message) {
        socket.emit('createMessage', {
            from: "user",
            text: message
        },()=>{from: "sss"}
        );
    }
});