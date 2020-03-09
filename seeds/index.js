const userSeed = require('./users/user.seed');


const seed = {

    exec: () => {
        userSeed.exec()

    }

}

module.exports = seed;