import React from 'react'
import _ from 'lodash'

import { MakeHttpRequest, sendChatMessage, sendInformation, listenToSocket } from './../utils/api'

class ChatBox extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            friends: [],
            currentUser: {},
            message: '',
            inboxMessage: []
        }
        this.friendList = this.friendList.bind(this)
        this.sendChat = this.sendChat.bind(this)
        this.onMessageChange = this.onMessageChange.bind(this)
        this.showAllMessage = this.showAllMessage.bind(this)
    }
    componentDidMount() {
        const userId = localStorage.getItem('userId')
        const makeRequestObject = new MakeHttpRequest(`/users/${userId}/friends`)
        makeRequestObject.makeRequest().then((data) => {
            const friends = _.get(data, ['data'])
            const currentUser = _.get(data, ['data', 0], {})
            this.setState({
                friends,
                currentUser
            })
        })
        sendInformation("register", { userId })
        listenToSocket('onMessage', function (err, message) {
            console.log(message, err)
        })
    }
    changeCurrentUser(value) {
        console.log(value)

    }
    onMessageChange(e) {
        const message = e.target.value
        this.setState({
            message
        })
    }
    sendChat(e) {
        e.preventDefault()
        const message = this.state.message
        const to = this.state.currentUser.userId
        const from = localStorage.getItem('userId')

        const payload = {
            message,
            from,
            to
        }
        sendChatMessage(payload, function (err, data) {
            console.log(data, 'testing data')
            if (!err) console.log('message send')
        })
    }
    friendList() {

        return this.state.friends.map((singleFriend) => {
            const {
                userId,
                name
            } = singleFriend
            return <option value={userId} key={userId}>{name}</option>
        })
    }
    showAllMessage() {
        return this.state.inboxMessage.map(message => {
            console.log(message)
        })
    }
    render() {

        return <div>
            Your Friend List is
            <select onChange={this.changeCurrentUser}>
                {this.friendList()}
            </select>
            <div>
                Message:
                <input placeholder="Chat" onChange={this.onMessageChange} value={this.state.message} />
                <input type="submit" onClick={this.sendChat}></input>
            </div>
            <div>
                Message Box:
                {this.showAllMessage()}
            </div>
        </div>
    }
}

export default ChatBox