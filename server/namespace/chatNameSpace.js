const _  = require('lodash')
var { createClient, sadd,hgetAll} = require('./../dataSource/redis')
module.exports = function (socket) {
    let publisher = createClient(), subscriber = createClient()
    socket.on('message', function (message) {
        const {
            to
        } = message
        console.log('publishing to channel', to)
        publisher.publish(`user:chat:${to}`, JSON.stringify(message))
    })
    socket.on("register", function (message) {
        const {
            userId
        } = message
        subscriber.subscribe(`user:chat:${userId}`)
    })
    subscriber.on('message', function (channel, channelMessage) {
        const userInformation = JSON.parse(channelMessage)
        const fromUserInformation = _.get(userInformation, ['from'])
        const message = _.get(userInformation, ['message'])
        const userKey = `user:${fromUserInformation}`
        hgetAll(userKey).then(userData => {
            const payload = {
                message,
                ...userData
            }
        socket.emit('onMessage', payload)
        })
    })
    socket.on('disconnect', function () {
        console.log('I am on disconnect')
    })
}