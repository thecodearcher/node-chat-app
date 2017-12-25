const path = require('path');
const express = require('express');
const socket = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');
const app = express();
var server = http.createServer(app);
var io = socket(server);
var port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
     console.log('server connected');

      socket.emit('newMessage',{
          from:"Admin",
          text:"Welcome to the chat app",
          createdAt: new Date().getTime()
      });

      socket.broadcast.emit('newMessage',{
          from:"Admin",
          text:"New User Joined app",
          createdAt:new Date().getTime()
      });


     socket.on('createMessage',(message)=>{
        
        io.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt: new Date().getTime()
        });

        console.log('create email',message);
     });
     socket.on('disconnect',()=>{
        console.log('User was disconnected');
     });

});

server.listen(port,()=>{
console.log('Server started on port ',port);
});