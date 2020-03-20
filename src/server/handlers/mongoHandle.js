'use strict'

class MongoHandle {

    constructor() {
        this.database = require('../config/database')
    }

    getUser(username) {
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('users').find({
                    lowername: username
                }).toArray( (error, result) => {
                    Database.close()
                    if(error){
                        reject(error)
                    }
                    resolve(result[0])
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    getUserInfo({userID, socketID = false}) {
        let queryProjection = null
        if(socketID){
            queryProjection = {
                "socketID": true
            }
        } else {
            queryProjection = {
                'username': true,
                'online': true,
                '_id': false,
                'id': '$_id'
            }
        }
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('users').aggregate([{
                    $match: {
                        _id: ObjectID(userID)
                    }
                    }, {
                        $project: queryProjection
                    }
                ]).toArray( (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    socketID ? resolve(result[0]['socketID']) : resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    createUser(data) {
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('users').insertOne(data, (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    checkUser(data) {
        return new Promise( async(resolve, result) => {
            try {
                const [Database, ObjectID] = await this.database.connect()
                
                Database.collection('users').find(data).count( (error, result) => {
                    Database.close()
                    if(error){
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    addSocketID({userID, socketID}){
        const data = {
            id: userID,
            value: {
                $set: {
                    socketID,
                    online: 'Y'
                }
            }
        }
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()
                
                Database.collection('users').update({ _id: ObjectID(data.id) }, data.value, (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    makeOnline(userID) {
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('users').findAndModify({
                    _id: ObjectID(userID)
                }, [], { "$set": {'online': 'Y'} }, {new: true, upsert: true}, (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result.value)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    getChatList(userID) {
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('users').aggregate([{
                    $match: {
                        'socketID': { $ne: userID }
                    }
                }, {
                    $project: {
                        'username': true,
                        'online': true,
                        '_id': false,
                        'id': '$_id'
                    }    
                }
                ]).toArray( (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    getMessages({ID, otherID}) {
        const data = {
            '$or' : [
                { '$and': [
                    {
                        'toUserID': ID
                    },{
                        'fromUserID': otherID
                    }
                ]
            },{
                '$and': [ 
                    {
                        'toUserID': otherID
                    }, {
                        'fromUserID': ID
                    }
                 ]
            }]
        }
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('messages').find(data).sort({'timestamp': 1}).toArray( (err, result) =>{
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    insertMessage(data) {
        return new Promise( async(resolve, reject) => {
            try {
                const [Database, ObjectID] = await this.database.connect()

                Database.collection('messages').insertOne(data, (err, result) => {
                    Database.close()
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = new MongoHandle()