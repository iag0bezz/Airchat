import React, { Component, memo } from 'react';

class Message extends Component {

  constructor(props){
      super(props)
  }

  render() {
    const { message, user } = this.props

    const data = {
      firstClass: `col-sm-12 message-main-${user._id == message.fromUserID ? 'sender' : 'receiver'}`,
      secondClass: `${user._id == message.fromUserID ? 'sender' : 'receiver'}`,
    }
    return (
        <div className="row message-body">
          <div className={data.firstClass}>
            <div className={data.secondClass}>
              <div className="message-text">
               {message.message}
              </div>
              <span className="message-time pull-right">
                Agora
              </span>
            </div>
          </div>
        </div>
    )
  }

}

export default memo(Message)