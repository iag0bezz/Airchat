const mongoHandle = require('./mongoHandle')

const password = require('../utils/password')

'use strict'
class RouteHandle {

    async login(request, response) {
        const data = {
            username: request.body.username,
            password: request.body.password
        }

        if(data.username == null || data.username == ''){
            return response.status(200).json({
                error: true,
                message: 'Usuário não pode ser vazio.'
            })
        }

        if(data.password == null || data.password == ''){
            return response.status(200).json({
                error: true,
                message: 'Senha não pode ser vazia.'
            })
        }

        data.lowername = (data.username).toLowerCase()

        try {
            const user = await mongoHandle.getUser(data.lowername)

            if(user == null || user == undefined){
                return response.status(200).json({
                    error: true,
                    message: 'Não foi possível encontrar este usuário.'
                })
            }

            if(password.compare(data.password, user.password)){
                await mongoHandle.makeOnline(user._id)

                return response.status(200).json({
                    error: false,
                    message: 'Autenticado com sucesso.',
                    user
                })
            } else {
                return response.status(200).json({
                    error: true,
                    message: 'Usuário ou senha está incorreto.'
                })
            }
        } catch (error) {
            return response.status(200).json({
                error: true,
                message: 'Ocorreu um erro inesperado, contate um administrador.'
            })
        }

    }

    async register(request, response) {
        const data = {
            username: request.body.username,
            password: request.body.password
        }

        if(data.username == null || data.username == ''){
            return response.status(400).json({
                error: true,
                message: 'Usuário não pode ser vazio.'
            })
        }

        if(data.password == null || data.password == ''){
            return response.status(400).json({
                error: true,
                message: 'Senha não pode ser vazia.'
            })
        }

        data.lowername = (data.username).toLowerCase()

        try {
            let user = await mongoHandle.getUser(data.lowername)

            if(user == null || user == undefined){
                data.online = 'Y'
                data.socketID = ''
                data.password = password.createHash(data.password)

                user = await mongoHandle.createUser(data)

                if(user == null || user == undefined){
                    return response.status(400).json({
                        error: true,
                        message: 'Não foi possível registrar este usuário.'
                    })
                }

                return response.status(200).json({
                    error: false,
                    message: 'Registrado com sucesso.',
                    user
                })
            } else {
                return response.status(400).json({
                    error: true,
                    message: 'Usuário já autenticado com este username.'
                })
            }

        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Ocorreu um erro inesperado, contate um administrador.'
            })
        }

    }

    async getMessages(request, response) {
        const data = {
            id: request.body.id,
            otherID: request.body.otherID
        }
        if(data.id == null || data.id == ''){
            return response.status(200).json({
                error: true,
                message: 'Não foi possível encontrar seu usuário.'
            })
        }
        try {
            const messages = await mongoHandle.getMessages({ID: data.id, otherID: data.otherID})
            return response.status(200).json({
                error: false,
                messages
            })
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Ocorreu um erro inesperado, contate um administrador.',
            })
        }
    }

}

module.exports = new RouteHandle()