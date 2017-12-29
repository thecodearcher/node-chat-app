
var socket = io();
var location_btn = document.getElementById('location_btn');
var message_template = document.getElementById('message-template').innerHTML; 
var location_template = document.getElementById('location-template').innerHTML; 

function scrollDown(){
    //selectors
    let message = $('#receivedmsg');
    let newMessage = message.children('last-child');
console.log(message);
console.log(newMessage.innerHeight());
console.log(newMessage.prev().innerHeight());
    //height
    let clientHeight = message.clientHeight;
    let scrollTop = message.scrollTop;
    let scrollHeight = message.scrollHeight;
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    console.log(clientHeight + scrollTop + newMessageHeight + lastMessageHeight);
    console.log(scrollHeight);
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
        message.scrollTop(scrollHeight);
        console.log('down');
    }
}

socket.on('connect', function () {
    console.log('connected');
});

socket.on('disconnect', function () {
    console.log('disconnect');
});

socket.on('newMessage', function (message) {
    let html = Mustache.render(message_template,{
        from:message.from,
        text:message.text,
        createdAt: `${ moment(message.createdAt).format('hh:mm a')}`
    });
 
       document.getElementById('receivedmsg').insertAdjacentHTML('beforeend',html);
       scrollDown();
});

socket.on('newLocation', function (data) {
    
    let html = Mustache.render(location_template, {
        from: data.from,
        url: data.url,
        createdAt: moment(data.createdAt).format('hh:mm a')
    });

    document.getElementById('receivedmsg').insertAdjacentHTML('beforeend',html);


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
        }, () => {}
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

        }, (e) => {

            location_btn.innerHTML = ' <ion-icon name="pin" color="primary"></ion-icon>';
            location_btn.setAttribute('disabled', 'false');
        });
        location_btn.setAttribute('disabled', 'true');
        location_btn.innerHTML = '<p text-wrap>Sending Location</p>';
        
    } else {
        location_btn.setAttribute('disabled', 'true');
        location_btn.outerHTML = '<p text-wrap>cannot send location</p>';
        
    }
});