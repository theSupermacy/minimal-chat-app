var { createClient, sadd, set } = require('./../dataSource/redis')
module.exports = function (socket) {
    let publisher = createClient(), subscriber = createClient()
    socket.on('message', function (message) {
        const {
            to
        } = message
        console.log('publishing to channel', to)
        publisher.publish(`user:${to}`, JSON.stringify(message))
    })
    socket.on("register", function (message) {
        const {
            userId
        } = message
        console.log('subscribing to ', userId)
        subscriber.subscribe(`user:${userId}`)
    })
    subscriber.on('message', function (channel, message) {
        console.log(channel, message)
        socket.emit('onMessage', message)
    })
    socket.on('disconnect', function () {
        console.log('I am on disconnect')
    })
}