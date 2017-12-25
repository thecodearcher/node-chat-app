var socket = io();


socket.on('connect',function(){
    console.log('connected');

    socket.emit('createMessage',{
        to:"brian",
        text:"socket"
    });
});

socket.on('disconnect',function(){
    console.log('disconnect');
});

socket.on('newMessage',function(email){
    console.log("new email",email);
});