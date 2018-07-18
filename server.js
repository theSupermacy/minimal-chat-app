const io = require('socket.io')();
const redis = require('redis');
const _ = require('lodash');
const process = require('process');
const client = redis.createClient({
  host: 'localhost',
  port: '6379',
});
const port = 8000;
io.listen(port);
let connectedUser = 0;
const onlineUsersHashPrefix = 'ONLINE_USERS';
const onlineUsersSocketSet = onlineUsersHashPrefix + 'socketSet';
console.log('server is starting on ' + port);
io.on('connection', function(socket) {
  setInterval(function() {
    socket.emit('date', new Date());
  }, 100000);
  connectedUser++;
  socket.broadcast.emit('users', connectedUser);
  socket.emit('users', connectedUser);
  socket.send(socket.id);
  socket.on('userInformation', function(message) {
    const multi = client.multi();
    const socketId = socket.id;
    const onlineUserHashName = onlineUsersHashPrefix + ':' + socketId;
    _.assign(message, { socketId });
    multi.hmset(onlineUserHashName, message);
    multi.set(socketId, onlineUserHashName);
    multi.sadd(onlineUsersSocketSet, socketId);
    multi.exec(function(err, replies) {
      if (!err) return socket.emit(replies);
    });
  });
  socket.on('getOnlineUsers', function() {
    const multi = client.multi({
      pipeline: false,
    });
    client.smembers(onlineUsersSocketSet, function(err, data) {
      const hashNames = data.map(function(socketId) {
        return onlineUsersHashPrefix + ':' + socketId;
      });
      hashNames.forEach(function(hashName) {
        multi.hgetall(hashName);
      });
      multi.exec(function(err, data) {
        console.log(data, 'onlineUsers');
        if (!err) {
          socket.broadcast.emit('getOnlineUsers', data);
          socket.emit('getOnlineUsers', data);
        } else console.log(err);
      });
    });
  });
  socket.on('sendChatMessage', function(data) {
    const senderSocketId = data.to;
    const from = data.from;
    const hashName = onlineUsersHashPrefix + ':' + from;
    client.hgetall(hashName, function(err, replies) {
      if (replies) {
        console.log(replies, from, data);
        const username = replies.username;
        const name = replies.name;
        const dataPacket = {
          message: data.chatMessage,
          username,
          data: replies,
        };
        socket.broadcast.to(senderSocketId).emit('messageRecieved', dataPacket);
      }
    });
  });

  socket.on('disconnect', function() {
    connectedUser--;
    socket.broadcast.emit('users', connectedUser);
    const socketId = socket.id;
    const onlineUserHashName = onlineUsersHashPrefix + ':' + socketId;
    const multi = client.multi();
    multi.del(onlineUserHashName);
    multi.del(socketId);
    multi.srem(onlineUsersSocketSet, socketId);
    multi.exec(function(err, replies) {
      console.log(replies);
      if (!err) return socket.emit(replies);
    });
  });
});
