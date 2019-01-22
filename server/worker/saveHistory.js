var redis = require('redis')

const subscribeForChat = redis.createClient({
    host: 'localhost',
    port: 16379
})
subscribeForChat.psubscribe(`user:chat:*`)

subscribeForChat.on('pmessage', function(pattern, channel, message) {
    console.log(channel, message, pattern)
    console.log('saved to DataBase')
})
