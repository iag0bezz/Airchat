const bcryptjs = require('bcryptjs')

class Password {

    createHash(password) {
        return bcryptjs.hashSync(password, 10)
    }

    compare(userPassword, dataPassword) {
        return bcryptjs.compareSync(userPassword, dataPassword)
    }

}

module.exports = new Password()