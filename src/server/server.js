'use strict'

const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const config = require('./config/config')

const appConfig = require('./config/app')
const socketEvents = require('./events/socket')

const routes = require('./routes/route')

class Server {

    constructor() {
        this.app = express()
        this.http = http.Server(this.app)
        this.socket = socketio(this.http)
    }

    initSocket() {
        new socketEvents(this.socket).init()
    }

    initRoutes() {
        new routes(this.app).init()
    }

    initApp() {
        new appConfig(this.app).init()
    }

    execute() {
        this.initApp()
        this.initRoutes()
        this.initSocket()

        const port = config.SERVER.PORT || 4000

        this.http.listen(port, () => console.log(`> Servidor aberto na porta ${port}`))
    }

}

const app = new Server()
app.execute()