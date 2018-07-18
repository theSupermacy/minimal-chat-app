import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

export const listenToSocket = function(event,cb) {
    console.log(event)
    socket.on(event, function(message) {
        return cb(message)
    })
}

export const sendInformation = function(event, userDetails, cb) {
    socket.emit(event, userDetails, function(message) {
        console.log(message)
        return cb(message)
    })
}

export const sendChatMessage = function(chatMessage, from ,to , cb) {
    socket.emit('sendChatMessage', {
        chatMessage, 
        from,
        to
    }, function(err, data){
        console.log(data)
        return cb(data)
    })
}

socket.on('disconnect', function(err){
    console.log(err)
})