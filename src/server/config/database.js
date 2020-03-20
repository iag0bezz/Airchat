'use strict'

const config = require('./config')

const mongodb = require('mongodb')
const assert = require('assert')

class Database {

    constructor() {
        this.mongoClient = mongodb.MongoClient
        this.ObjectID = mongodb.ObjectID
    }

    connect(){
        const mongoURL = config.DATABASE.URL

        return new Promise( (resolve, reject) => {
            this.mongoClient.connect(mongoURL, (err, Database) => {
                if(err){
                    reject(err)
                } else {
                    assert.equal(null, err)
                    resolve([Database, this.ObjectID])
                }
            })
        })
    }

}

module.exports = new Database()