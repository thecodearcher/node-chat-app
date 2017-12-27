
var socket = io();
var location_btn = document.getElementById('location_btn');


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
    li.textContent =  `${message.from}  ${moment(message.createdAt).format('hh:mm a')} :   ${message.text}`;

    document.getElementById('receivedmsg').appendChild(li);
});
socket.on('newLocation', function (data) {
    var li = document.createElement('ion-item');
    var link = document.createElement('a');
    link.setAttribute('href', data.url);
    link.setAttribute('target', "_blank");
    link.textContent = "My Current Location";
    li.innerText = `${data.from}  ${moment(data.createdAt).format('hh:mm a')} :`;
    li.appendChild(link);


    document.getElementById('receivedmsg').appendChild(li);
    location_btn.innerHTML = ' <ion-icon name="pin" color="primary"></ion-icon>';
    location_btn.setAttribute('disabled', 'false');

});

document.getElementById('chatform').addEventListener('submit', (e) => {
    e.preventDefault();

    message = document.getElementById('msg').value;
    if (message) {
        socket.emit('createMessage', {
            from: "user",
            text: message
        }, () => { from: "sss" }
        );
    }
});


location_btn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            let latitude = pos.coords.latitude;
            let longitude = pos.coords.longitude;

            socket.emit('shareLocation', {
                latitude,
                longitude
            });

            console.log('position', pos);
        }, (e) => {
            console.log('cannot get loac', e);
        });
        location_btn.setAttribute('disabled', 'true');
        location_btn.innerHTML = '<p text-wrap>Sending Location</p>'
    } else {
        console.log('no location service');
    }
});