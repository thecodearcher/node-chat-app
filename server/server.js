const path = require('path');
const express = require('express');
const socket = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');
const app = express();

const {generateMessage} = require('./utils/message');
var server = http.createServer(app);
var io = socket(server);
var port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
     console.log('server connected');

    socket.emit('newMessage', generateMessage("admin", "Welcome to chat app"));

    socket.broadcast.emit('newMessage', generateMessage("Admin", "New User Joined"));


     socket.on('createMessage',(message,callback)=>{
        
        io.emit('newMessage',generateMessage(message.from,message.text));

        console.log('create email',message);
        callback({
            from:"got forom"
        });
     });
     socket.on('disconnect',()=>{
        console.log('User was disconnected');
     });

});

server.listen(port,()=>{
console.log('Server started on port ',port);
});