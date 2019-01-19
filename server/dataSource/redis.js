var redis = require('redis');
var bp = require('bluebird')
var config = require("./../config/redis")
const client = redis.createClient(config)

module.exports = {
    client,
    set: bp.promisify(client.set).bind(client),
    get: bp.promisify(client.get).bind(client),
    hgetAll: bp.promisify(client.hgetall).bind(client),
    smembers: bp.promisify(client.smembers).bind(client),
    sadd: bp.promisify(client.sadd).bind(client),
    hmset: bp.promisify(client.hmset).bind(client)

}

