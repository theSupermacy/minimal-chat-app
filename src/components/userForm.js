import React from 'react'


class UserForm extends React.Component {
    onMobileChange
    constructor(params) {
        super(params)
        this.state = {
            name: '',
            email: '',
            mobileNumber: ''
        }
        this.onTextChange = this.onTextChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onTextChange(e, key) {
        console.log(e.target.value, key)
        this.setState({
            [key]: e.target.value
        })
    }
    onSubmit(e) {
        e.preventDefault()
        const {
            name,
            email,
            mobileNumber
        } = this.state
        if (name && email && mobileNumber)
            this.props.submit({
                name,
                email,
                mobileNumber
            })
    }
    render() {
        return (<div>
            <form>
                <label>
                    Name:
            <input
                        name="name"
                        type="text"
                        onChange={(value) => this.onTextChange(value, 'name')}
                        value={this.state.name} />
                </label>
                <label>
                    Email:
            <input name="email" type="email"
                        onChange={(value) => this.onTextChange(value, 'email')}
                        value={this.state.email} />
                </label>
                <label>
                    Mobile Number
            <input
                        name="mobileNumber"
                        type="mobile"
                        onChange={(value) => this.onTextChange(value, 'mobileNumber')}
                        value={this.state.mobileNumber} />
                </label>
                <input type="submit" name="SignUp" onClick={this.onSubmit} />
            </form>
        </div>)
    }
}

export default UserForm