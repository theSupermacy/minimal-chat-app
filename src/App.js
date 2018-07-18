import React, { Component } from 'react';
import _ from 'lodash'
import logo from './logo.svg';
import './App.css';
import {
  listenToSocket, sendInformation, sendMessage, sendChatMessage
} from './utils/api'
import {
  generateData
} from './utils/faker'
class App extends Component {
  state = {
    timestamp: undefined,
    message: undefined,
    dateEvent: undefined,
    users: -1,
    currentUserDetails: {
      username: undefined,
      name: undefined,
      avatar: undefined,
      socketId: undefined
    },
    onlineUsers: [],
    chatBoxMessage: "",
    senderSocketId: undefined,
    chatMessageResponse: undefined,
    inbox: []
  }
  constructor(props) {
    super(props)
    this.chatBoxHandler = this.chatBoxHandler.bind(this)
    this.selectChatUsername = this.selectChatUsername.bind(this)
    this.submitButtonHandler = this.submitButtonHandler.bind(this)
    this.showCorrectMessage = this.showCorrectMessage.bind(this)
    this.showIncomingMessages = this.showIncomingMessages.bind(this)
  }
  componentDidMount() {
    const self = this
    listenToSocket('message',function(message) {
      const currentUserDetails = self.state.currentUserDetails
      currentUserDetails.socketId = message
      self.setState({
        message,
        currentUserDetails
       })
    })
    const currentUserDetails = generateData().currentUserDetails
    listenToSocket('date',function(date) {
      self.setState({
        dateEvent: date
      })
    })
    listenToSocket('users', function(users){
      self.setState({
        users
      })
    })
    sendInformation('userInformation', currentUserDetails, function(data) {
      console.log(data)
    })
    listenToSocket('messageRecieved', function(message){
      const inboxMessage = self.state.inbox
      inboxMessage.push(message)
      self.setState({
        inbox: inboxMessage
      })

    })
    sendInformation('getOnlineUsers', currentUserDetails,function(allOnlineUsers) {})
    listenToSocket('getOnlineUsers',function(allOnlineUsers) {
      const onlineUsers = allOnlineUsers.filter(function(allUsername){
        console.log(self.state, allUsername)
        if(self.state.currentUserDetails.username === allUsername.username)
          return false;
        return true;
      })
      self.setState({
        onlineUsers
      })
    })
    this.setState({
      currentUserDetails
    })
    
  }
  chatBoxHandler(e) {
    const chatBoxMessage = e.target.value
    this.setState({
      chatBoxMessage
    })
  }
  selectChatUsername(e){
    const socketId = e.target.value
    this.setState({
      senderSocketId: socketId
    })
  }
  submitButtonHandler(){
     console.log(this.state)
     const senderSocketId = this.state.senderSocketId
     const currentUserSocketId = this.state.currentUserDetails.socketId
     const message = this.state.chatBoxMessage
     const inbox = this.state.inbox
     const messagePacket = {
       senderUsername: undefined,
       message,
       data: this.state
     }
     this.setState()
     sendChatMessage(message, currentUserSocketId, senderSocketId, function(err, data){
       if(!err) this.setState({
         chatMessageResponse: "Your Message Has Been Send"
       })
     })
  }
  showIncomingMessages() {
    if(this.state.inbox.length)
    return this.state.inbox.map(message => {
      const userImage = message.data.avatar
      const senderUsername = message.username || 'You'
      const chatMessage = message.message
      return (<div>
         <img alt="avatar" src="userImage" /> <p> {senderUsername} : {chatMessage}</p>
          </div>)
    })
    return (<div>
      <p> Your Inbox is empty </p>
      </div>)
  }
  showCorrectMessage() {
    if(this.state.chatMessageResponse)
    return (<div> 
      <p>
        {this.state.chatMessageResponse}
        </p>
    </div>)
    return <div />
  }
  render() {
    const onlineUsers = this.state.onlineUsers
    const Image = this.state.currentUserDetails.avatar
    return (
      <div className="App">
        <header className="App-header">
          <img src={Image} alt="avatar" style={{
            borderRadius: '50%'}}/>
          <h1 className="App-title">Hi {this.state.currentUserDetails.name},</h1>
          <p> Your username is {this.state.currentUserDetails.username}</p>
        </header>
        <p className="App-intro">
         Your Socket id is {this.state.timestamp || this.state.message }
        </p>
        <p className="App-intro">
        { this.state.dateEvent}
        </p>
        <p> Number of user Connected: {this.state.users}</p>
        <div>
        {this.showIncomingMessages()}
          </div>
        <div>
        <input type="text" placeholder = "Write Something here" onChange={this.chatBoxHandler} value={this.state.chatBoxMessage} />
        <select name="select" onChange={this.selectChatUsername}> {
          onlineUsers.length !=0 
          ?
          onlineUsers.map((singleOnlineUserDetails, index )=> {
            const socketId = singleOnlineUserDetails.socketId || index
            const username = singleOnlineUserDetails.username
            return <option value = {socketId} key={socketId}> {singleOnlineUserDetails.username} </option>
          })
          :
          <option value = {"none"}> None</option>
        }</select>
        <button onClick={this.submitButtonHandler}>Submit</button>
        </div>
        {this.showCorrectMessage}
      </div>
    );
  }
}

export default App;
