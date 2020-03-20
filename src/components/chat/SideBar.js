import React, { Component } from 'react';

export default class SideBar extends Component {

  constructor(props){
      super(props)
  }

  perform = () =>{
      const { change, chat } = this.props
  
      change(chat)  
  }

  render() {
    const { chat } = this.props
    return (
        <div className="row sideBar-body" onClick={this.perform}>
            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                <div className="avatar-icon">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_MQtIoMDfCMoF8WXayhmFEY341PiMqX3w9FTMvyg_fshz_x4N" />
                </div>
            </div>
            <div className="col-sm-9 col-xs-9 sideBar-main">
                <div className="row">
                    <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">{chat.username}</span>
                    </div>
                </div>
            </div>
        </div>
    );
  }

}