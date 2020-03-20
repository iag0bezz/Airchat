import React, { Component } from 'react';

import './styles/ChatComponent.css';

import SideBar from './chat/SideBar'
import Conversation from './chat/Conversation'

export default class ChatContainer extends Component {

  constructor(props){
    super(props)

    this.state = {
      chatList: [],
      loading: true,

      activeChat: null
    }
  }

  componentDidMount() {
    const { socket, user } = this.props

    this.socketEvents(socket)

    socket.emit('chat-list', { userID: user._id })
  }

  socketEvents = (socket) => {

    socket.on('chat-list-response', (data) => {
      if(data.singleUser){
        return
      }

      this.setChatList(data)
      this.setLoading(false)
    })

  }

  setChatList = (data) => {
    this.setState({chatList: data.chatList})
  }

  setLoading = (data) => {
    this.setState({loading: data})
  }

  setActiveChat = (chat) => {
    const { activeChat } = this.state
    
    if(activeChat == chat){
      return
    }

    this.setState({activeChat: chat})
  }

  render() {
    const { user, axios, socket } = this.props
    const { chatList, loading, activeChat } = this.state
    return (
      <div className="container app">
        <div className="row app-one">
          <div className="col-sm-4 side">

            <div className="side-one">

              <div className="row heading">
                <div className="col-sm-3 col-xs-3 heading-avatar">
                  <div className="heading-avatar-icon">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_MQtIoMDfCMoF8WXayhmFEY341PiMqX3w9FTMvyg_fshz_x4N"/>
                  </div>
                </div>
                <div className="col-sm-4 heading-name">
                    <a className="heading-name-meta">{user.username}</a>
                </div>
              </div>

              <div className="row sideBar">
              
                {
                  loading ? <p>Carregando</p> : chatList.filter((filter) => filter.id != user._id).map((chat) => <SideBar change={this.setActiveChat} key={chat.id} chat={chat} /> )
                }
                
              </div>

            </div>

          </div>
          
          {
            activeChat == null ? null : <Conversation key={activeChat.id} user={user} conversation={activeChat} axios={axios} socket={socket} />
          }

        </div>
      </div>
    );
  }

}