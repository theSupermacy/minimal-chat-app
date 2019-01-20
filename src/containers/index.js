import React from 'react'
import _ from 'lodash'

import UserForm from './../components/userForm'
import { MakeHttpRequest } from './../utils/api'
import ChatBox from '../components/ChatBox';


class Root extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            showLoginState: false
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount() {
        const showLoginState = !!localStorage.getItem('showLoginState')
        console.log(showLoginState, 'testing', localStorage.getItem(showLoginState))
        this.setState({
            showLoginState
        })
    }
    onSubmit({
        email,
        mobileNumber,
        name
    }) {
        const apiObject = new MakeHttpRequest('/users')
        apiObject.makeRequest({
            method: 'POST',
            body: {
                email,
                mobileNumber,
                name
            }
        })
            .then((data) => {
                console.log(data)
                const userId = _.get(data, ['data', 'userId'])
                localStorage.setItem('showLoginState', 'true')
                localStorage.setItem('userId', userId)
                this.setState({
                    showLoginState: true
                })
            })
    }
    render() {
        console.log(this.state)
        if (!this.state.showLoginState)
            return (
                <UserForm submit={this.onSubmit} />
            )
        return (
            <ChatBox />
        )
    }
}

export default Root