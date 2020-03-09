const userService = require('../../app/components/users/user.service');
const config = require('../../app/framework/config/env');

const seed = {
    init: () => {
        userService.addSeedUser(config.seed.user.email, config.seed.user.pass, config.seed.user.name)
            .then(result => console.log(!!result))
            .catch(err => console.log(err));
    }
}

module.exports = seed