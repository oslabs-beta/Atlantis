import React, { Component } from 'react';
//import github from './github.svg';
class Form extends Component {

  state = {
    name: "",
    username: "",
    password: ""
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.handleSubmit(this.state)
  }

    handleSubmit = (e) => {
      e.preventDefault()
    
    console.log("made it to handle sub")
    const user = this.props.users.find(user => user.username === this.state.username)
    console.log(user, "user & handle sub")
    return this.props.currentUser(user)
    
}

  handleChange = (e) => {
    let {name, value} = e.target
    this.setState({
      [name]: value
    })
  }

  render() {
    let {formName} = this.props
    let {name, username, password} = this.state

    return (
      <form onSubmit={this.handleSubmit}>

        <div className="form">
        <h2>{formName}</h2>
        <h3>Hey, Good to see you! </h3>
          <div className="formContent">
            <label htmlFor="name">Name:</label>
            <input className="input" type="text" autoComplete="off" name="name" value={name} onChange={this.handleChange}/><br/>
            <label htmlFor="username">Username:</label>
            <input className="input" type="text" autoComplete="off" name="username" value={username} onChange={this.handleChange}/><br/>
            <label htmlFor="password">Password:</label>
            <input className="input" type="password" autoComplete="off" name="password" value={password} onChange={this.handleChange}/><br/>
          </div>
            <input className="submitButton" type="submit" value="Submit"/>
            <h3>Or Authenticate with </h3>
            <a href="https://imgur.com/N4okLOv"><img src="https://i.imgur.com/N4okLOv.png" title="" /></a><br/>

            <button onClick={this.props.handleLoginGithub}>GITHUB</button>
        </div>
      </form>
    );
  }

}

export default Form;