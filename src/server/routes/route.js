'use strict'

const routeHandler = require('../handlers/routeHandle')

class Route {

    constructor(app){
        this.app = app
    }

    init() {

        this.app.post('/auth/login', routeHandler.login)
        this.app.post('/auth/register', routeHandler.register)
        
        this.app.post('/messages', routeHandler.getMessages)

    }

}

module.exports = Route