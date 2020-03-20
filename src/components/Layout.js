import React, { useState } from 'react';

import io from 'socket.io-client'
import axios from 'axios'

import AuthenticationForm from './AuthenticationForm'
import ChatContainer from './ChatContainer'

const baseURL = 'http://localhost:3666'

export default class Layout extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        socket: null,
        axios: null,

        user: ''
      };
    }

    componentWillMount() {
        this.init()
    }

    init = () => {
        const _axios = axios.create({
          baseURL
        })

        this.setState({axios: _axios})
    }

    setUser = (user) => {
      const socket = io(baseURL, { query: `userID=${user._id}` })

      socket.on('connect', () => {
          console.log('Connected on socket server.')
      })

      this.setState({user, socket})
    }

    render() {
      const { socket, axios, user } = this.state
      return (
        !user ?	
        <AuthenticationForm socket={socket} axios={axios} setUser={this.setUser} />
        :
        <ChatContainer socket={socket} axios={axios} user={this.state.user} />
      );
    }

}