import React, { Component } from 'react';

import './styles/AuthenticationForm.css'

import Login from './auth/Login'
import Register from './auth/Register'

export default class AuthenticationForm extends Component {

  constructor(props){
      super(props)

      this.state = {
          type: 1,
          loading: false
      }
  }

  handleSubmit = async (e) => {
      e.preventDefault();

      const data = {
        username: e.target.username.value,
        password: e.target.password.value
      }

      const { axios, setUser } = this.props

      const response = await axios.post(`/auth/${this.state.type == 1 ? 'login' : 'register'}`, data)

      if(response.data.error){
        alert(response.data.message)
      } else {
        alert(response.data.message)

        setUser(response.data.user)
      }
  }

  handleChange = (e) => {
      this.setState({type: (this.state.type == 1 ? 0 : 1)})
  }

  render() {
	return (
		  this.state.type == 1 ? 
        <Login perform={this.handleSubmit} change={this.handleChange} /> 
        : 
        <Register perform={this.handleSubmit} change={this.handleChange} />
	  );
  }

}