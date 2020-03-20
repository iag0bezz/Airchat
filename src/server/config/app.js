const bodyParser = require('body-parser')
const cors = require('cors')

class App {

    constructor(app){
        this.app = app
    }

    init() {
        this.app.use(bodyParser.json())
        this.app.use(cors())
    }

}

module.exports = App