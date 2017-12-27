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
socket.on('newLocation', function (data) {
    var li = document.createElement('ion-item');
    var link = document.createElement('a');
    link.setAttribute('href',data.url);
    link.setAttribute('target',"_blank");
    link.textContent = "My Current Location";
    li.innerText =   data.from + ': ';
    li.appendChild(link);
    

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

var location_btn = document.getElementById('location_btn');

location_btn.addEventListener('click',()=>{
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition((pos)=>{
            let latitude = pos.coords.latitude;
            let longitude = pos.coords.longitude;

            socket.emit('shareLocation',{
                latitude,
                longitude
            });

            console.log('position',pos);
        },(e)=>{
            console.log('cannot get loac',e);
        })
    }else{
        console.log('no location service');
    }
});