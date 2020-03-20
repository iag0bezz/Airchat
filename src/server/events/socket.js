'use strict'

const path = require('path')
const mongoHandle = require('../handlers/mongoHandle')

class Socket {

    constructor(socket){
        this.io = socket;
    }

    events() {

        this.io.on('connection', (socket) => {

            socket.on('chat-list', async(data) => {
                if(data.userID == ''){
                    this.io.emit('chat-list-response', {
                        error: true,
                        message: 'Não foi possível encontrar seu usuário.'
                    })
                } else {
                    try {
                        const [UserInfoResponse, ChatListResponse] = await Promise.all([
                            mongoHandle.getUserInfo({
                                userID: data.userID,
                                socketID: false
                            }),
                            mongoHandle.getChatList(socket.id)
                        ])
                        this.io.to(socket.id).emit('chat-list-response', {
                            error: false,
                            singleUser: false,
                            chatList: ChatListResponse
                        })

                        socket.broadcast.emit('chat-list-response', {
                            error: false,
                            singleUser: true,
                            chatList: UserInfoResponse
                        })
                    } catch (error) {
                        this.io.to(socket.id).emit('chat-list.response', {
                            error: true,
                            chatList: []
                        })
                    }
                }
            })

            socket.on('new-message', async(data) => {
                if(data.message == ''){
                    return
                }
                if(data.fromUserID == ''){
                    return
                }
                if(data.toUserID == ''){
                    return
                }
                try {
                    const [toSocketID, messageResult] = await Promise.all([
                        mongoHandle.getUserInfo({
                            userID: data.toUserID,
                            socketID: true
                        }),
                        mongoHandle.insertMessage(data)
                    ])
                    this.io.to(toSocketID).emit('new-message-response', data)
                } catch (error) {
                    this.io.to(socket.id).emit('new-message-response', {
                        error: true,
                        message: 'Ocorreu um erro ao processar sua mensagem.'
                    })
                }
            })

        })

    }

    init() {
        this.io.use( async(socket, next) => {
            try {
                console.log(socket.request._query)
                await mongoHandle.addSocketID({
					userID: socket.request._query['userID'],
					socketID: socket.id
				});
                next()
            } catch (error) {
                console.error(error)
            }
        })

        this.events()
    }

}

module.exports = Socket