const userRepository = require('./user.repository');
const bcrypt = require('bcryptjs');

const service = {
    register: (email, name, password) => {

        const passwordHash = bcrypt.hashSync(password, 8);

        const newUser = {
            name: name,
            email: email,
            password: passwordHash,
            status: 'active'
        }

        return userRepository.insert(newUser)

    },
    authenticate: (email, password) => new Promise((resolve, reject) => {

        console.log(email);

        userRepository.authenticate(email)
            .then(user => {

                if (bcrypt.compareSync(password, user.password) && user.status == 'active') {
                    resolve(user)
                } else {
                    resolve(false)
                }

            })
            .catch(error => reject(error))
    }),
    storeResfreshToken: (idUser, refreshToken) => {

        return userRepository.setRefreshToken(idUser, refreshToken);
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
