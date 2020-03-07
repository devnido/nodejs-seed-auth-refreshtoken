const userRepository = require('./user.repository');
const passwordService = require('../../framework/services/password.service');

const service = {
    register: async(email, name, password) => {

        const hashedPassword = passwordService.hashPassword(password);

        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            status: 'active'
        }

        const userAdded = await userRepository.insert(newUser);

        userAdded.password = ':)';

        return userAdded;

    },
    authenticate: async(email, password) => {

        console.log(email);

        const user = await userRepository.findToAuthentication(email)

        if (!user) {
            return false
        }

        if (passwordService.comparePassword(password, user.password) && user.status === 'active') {
            return user
        } else {
            return false
        }

    },
    existsByEmail: email => userRepository.existsByEmail(email),

    existsByResetPassToken: resetPassToken => userRepository.existsByValidResetPassToken(resetPassToken, Date.now()),

    getUserByEmail: email => userRepository.findByEmail(email),

    storeResetPassToken: async(email, resetPassToken) => {

        const expDate = Date.now() + 1000 * 60 * 60 * 24 * 2 // 2 days in milliseconds

        const user = await userRepository.setResetPassToken(email, resetPassToken)

        user.password = ':)'

        return user

    },
    storeResfreshToken: async(idUser, refreshToken) => {

        const expDate = Date.now() + 1000 * 60 * 60 * 24 * 2 // 2 days in milliseconds

        const user = await userRepository.setRefreshToken(idUser, refreshToken, expDate);

        user.password = ':)'

        return user
    },
    isBlocked: async(idUser) => {

        const user = await userRepository.findById(idUser)

        return (user && user.status === 'blocked');

    },
    hasRefreshToken: async(idUser, refreshToken) => {

        const user = await userRepository.findByIdWithRefreshToken(idUser)

        return (user && user.refreshToken != null && user.refreshToken === refreshToken)

    }
}

module.exports = service;