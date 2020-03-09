const userSeed = require('./users/user.seed');


const seed = {

    init: () => {
        userSeed.init()

    }

}

module.exports = seed;