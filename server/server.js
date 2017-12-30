const path = require('path');
const express = require('express');
const socket = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');
const app = express();

const {generateMessage, generateLocation} = require('./utils/message');
const {isRealString} = require('./utils/validator');
const {Users} = require('./utils/users');

var server = http.createServer(app);
var io = socket(server);
var users = new Users();
var port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
     console.log('server connected');

   

     socket.on('createMessage',(message,callback)=>{
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));

        }
        
     });

     socket.on('shareLocation',(coords)=>{
         let user = users.getUser(socket.id);

         if (user) {
             io.to(user.room).emit('newLocation',generateLocation(user.name,coords.latitude,coords.longitude));
         }
    });

     socket.on('disconnect',()=>{
         let user = users.removeUser(socket.id);

         if(user){
             io.to(user.room).emit('updateUserList',users.getUserList(user.room));
             io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} Left The Room`));
         }
        console.log('User was disconnected');
     });

     socket.on('join',(data,callback)=>{
         if (!isRealString(data.username) || !isRealString(data.room)){
           return  callback('Invalid Details');
         }

         socket.join(data.room);
         users.removeUser(socket.id);
         users.addUser(socket.id,data.username,data.room);

         io.to(data.room).emit('updateUserList',users.getUserList(data.room));
         socket.emit('newMessage', generateMessage("Admin", "Welcome to chat app"));
         socket.broadcast
         .to(data.room)
         .emit('newMessage', generateMessage("Admin", `${data.username} Has Joined`));

         callback();
     });

});

server.listen(port,()=>{
console.log('Server started on port ',port);
});