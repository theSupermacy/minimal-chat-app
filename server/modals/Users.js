const {
    hgetAll,
    smembers,
    sadd,
    hmset
} = require('./../dataSource/redis')
const _ = require('lodash')
const uuid = require('uuid/v1')
const moment = require('moment')
class Users {
    constructor(userId) {
        this.userId = userId

    }
    _getFriendsKey(key) {
        return `${this._getUserKey(key)}:friends`

    }

    getUserInformationById() {
        console.log(this._getUserKey(this.userId))
        if (this.userId)
            return hgetAll(this._getUserKey(this.userId))
        throw new Error('Need UserId')
    }
    getUserFriends() {
        if (this.userId)
            return smembers(this._getFriendsKey(this.userId))
                .then(data => Promise.all(data.map(singleData => hgetAll(singleData))))
        throw new Error('Need UserId')
    }
    _getUserKey(userId) {
        return `user:${userId}`
    }
    addUser(options) {
        this.email = _.get(options, 'email')
        this.mobileNumber = _.get(options, 'mobileNumber')
        this.name = _.get(options, 'name')
        this.userId = uuid()
        this.createdAt = moment()
        const userData = {
            email: this.email,
            mobileNumber: this.mobileNumber,
            userId: this.userId,
            name: this.name,
            createdAt: this.createdAt
        }
        const userKey = this._getUserKey(this.userId)
        return hmset(userKey, userData).then(data => this)
    }
    makeFriend(friendId) {
        if (this.userId) {
            const userKey = this._getUserKey(this.userId)
            const userNameSpaceKey = this._getFriendsKey(this.userId)
            const friendNameSpaceKey = this._getFriendsKey(friendId)
            const friendKey = this._getUserKey(friendId)
            return Promise.all([sadd(userNameSpaceKey, friendKey), sadd(friendNameSpaceKey, userKey)])
                .then(data => ({
                    data,
                    message: "Friends Added Successfully"
                }))
        }
        throw new Error('Need UserId')
    }
}
module.exports = Users
