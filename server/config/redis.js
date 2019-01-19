class Redis {
    constructor() {
        this.host = process.env.REDIS_HOST
        this.port = process.env.REDIS_PORT
    }
}


module.exports = new Redis()