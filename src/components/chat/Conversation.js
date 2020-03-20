import React, { Component } from 'react';

import Message from './Message'

export default class Conversation extends Component {

  constructor(props){
      super(props)

      this.state = {
          messages: [],
          conversation: props.conversation
      }
  }

  componentDidUpdate() {
    const shouldScroll = this.chat.scrollTop + this.chat.clientHeight === this.chat.scrollHeight;

    if(!shouldScroll) this.chat.scrollTop = this.chat.scrollHeight
  }

  async componentDidMount() {
    this.loadMessages()

    const { socket } = this.props

    socket.on('new-message-response', (data) =>{
      if(data.fromUserID != this.state.conversation.id){
        return
      }
      this.setState({messages: [...this.state.messages, data]})
    })
  }

  async componentWillReceiveProps(nextProps) {
    await this.setState({conversation: nextProps.conversation, messages: []})

    await this.loadMessages()
  }

  async loadMessages() {
    const { axios, user } = this.props
    const { conversation } = this.state

    const response = await axios.post('/messages', { id: user._id, otherID: conversation.id })

    this.setState({messages: response.data.messages})
  }

  sendMessage = () => {
    const message = this.message.value

    if(message == '' || message == null || message == undefined){
      return
    }
    const { socket, user, conversation } = this.props

    this.message.value = ''

    const data = {
      message: (message).trim(),
      toUserID: conversation.id,
      fromUserID: user._id
    }

    this.setState({messages: [...this.state.messages, data]})

    socket.emit('new-message', data)
  }

  onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      
      this.sendMessage()
    }
  }

  render() {
    const { user } = this.props
    const { messages, conversation } = this.state
    return (
        <div className="col-sm-8 conversation">

            <div className="row heading">
              <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
                <div className="heading-avatar-icon">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_MQtIoMDfCMoF8WXayhmFEY341PiMqX3w9FTMvyg_fshz_x4N" />
                </div>
              </div>
              <div className="col-sm-8 col-xs-7 heading-name">
                <a className="heading-name-meta">{conversation.username}</a>
                <p className="heading-online">{conversation.online == 'Y' ? 'online' : 'offline'}</p>
              </div>
            </div>

            <div ref={(c) => this.chat = c} className="row message" id="conversation">
              
                <br/>

                {messages.map((message) => <Message key={message._id} message={message} user={user} />)}

            </div> 

            <div className="row reply">
              <div className="col-sm-11 col-xs-11 reply-main">
                <textarea ref={(c) => this.message = c} onKeyDown={this.onEnterPress} className="form-control" rows="1" id="comment"></textarea>
              </div>
              <div className="col-sm-1 col-xs-1 reply-send">
                <a href="#" onClick={this.sendMessage}>
                  <i className="fa fa-send fa-2x" aria-hidden="true"></i>
                </a>
              </div>
            </div>
  
        </div>
    )
  }

}