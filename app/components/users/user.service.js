const userRepository = require('./user.repository');
const passwordService = require('../../framework/services/password.service');

const service = {
    register: (email, name, password) => {

        const hashedPassword = passwordService.hashPassword(password);

        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            status: 'active'
        }

        return userRepository.insert(newUser)
    },
    authenticate: (email, password) => new Promise((resolve, reject) => {

        console.log(email);

        userRepository.findToAuthentication(email)
            .then(user => {
                if (passwordService.comparePassword(password, user.password) && user.status == 'active') {
                    resolve(user)
                } else {
                    resolve(false)
                }
            })
            .catch(error => reject(error))
    }),
    existsByEmail: email => userRepository.existsByEmail(email),

    existsByChangeToken: changeToken => userRepository.existsByValidChangeToken(changeToken, Date.now()),

    getUserByEmail: email => userRepository.findByEmail(email),

    generateAndStoreChangeToken: (email) => new Promise((resolve, reject) => {

        let result = {};

        tokenService.generateChangeToken()
            .then(changeToken => {
                result.changeToken = changeToken;
                return userRepository.setChangeToken(email, changeToken)
            })
            .then(userUpdated => {

                result.userUpdated = userUpdated;

                resolve(result)
            })
            .catch(error => {
                reject(error)
            })

    }),
    storeResfreshToken: (idUser, refreshToken) => {

        const expDate = Date.now() + 1000 * 60 * 60 * 24 * 2 // 2 days

        return userRepository.setRefreshToken(idUser, refreshToken, expDate);
    },
    isBlocked: (idUser) => new Promise((resolve, reject) => {
        userRepository.findByID(idUser)
            .then(user => {

                resolve(user && user.status == 'blocked');
            })
            .catch(err => {
                reject(err)
            })
    }),
    hasRefreshToken: (idUser, refreshToken) => new Promise((resolve, reject) => {
        userRepository.findByID(idUser)
            .then(user => {
                resolve(user && user.refreshToken != null && user.refreshToken == refreshToken)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = service;