import openSocket from 'socket.io-client';
import axios from 'axios'
const chatNameSpace = openSocket('ws://localhost:3000/chat', {
});


export const listenToSocket = function (event, cb) {
    console.log(event)
    chatNameSpace.on(event, function (message) {
        return cb(message)
    })
}

export const sendInformation = function (event, userDetails, cb) {
    chatNameSpace.emit(event, userDetails, function (message) {
        console.log(message)
        return cb(message)
    })
}

export const sendChatMessage = function (payload, cb) {
    console.log('payload', payload)
    chatNameSpace.emit('message', payload, function (err, data) {
        console.log(data)
        return cb(data)
    })
}

chatNameSpace.on('disconnect', function (err) {
    console.log(err)
})


export class MakeHttpRequest {
    constructor(url) {
        this.url = `http://localhost:3000${url}`

    }
    makeRequest(options = {}) {
        const defaultOptions = {
            url: this.url,
            method: options.method || 'get',
            params: options.params,
            data: options.body
        }
        console.log(defaultOptions)
        return axios(defaultOptions).then(data => data.data)
    }
}


