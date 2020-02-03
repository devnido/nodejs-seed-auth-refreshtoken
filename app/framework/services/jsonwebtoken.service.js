const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../framework/config/env');
const randToken = require('rand-token');

const service = {

    generateRefreshToken: () => new Promise(resolve => {

        const refreshToken = randToken.uid(128);

        resolve(refreshToken);

    }),

    generateJwt: (idUser) => new Promise((resolve, reject) => {
        try {

            const payload = {
                uid: idUser,
                exp: moment().add(2, 'years').unix()
            }

            const secret = config.app.secretApi;

            const options = {
                algorithm: 'HS256'
            }

            const token = jsonwebtoken.sign(payload, secret, options)

            resolve(token)

        } catch (error) {
            reject(error)
        }
    }),
    verifyJwt: token => new Promise((resolve, reject) => {

        const secret = config.app.secretApi;

        const decoded = jsonwebtoken.verify(token, secret);

        if (decoded) {

            resolve(decoded);

        } else {
            throw 'undecoded'
        }
    }),
    decode: (jwt) => {
        return new Promise((resolve, reject) => {
            try {
                const secret = config.app.secretApi;

                const tokenDecoded = jsonwebtoken.verify(jwt, secret, {
                    ignoreExpiration: true
                });

                const result = {};

                if (tokenDecoded) {

                    result.uid = tokenDecoded.uid;

                    if (tokenDecoded.exp <= moment().unix()) {

                        result.status = 'expired';

                    } else {

                        result.status = 'active';

                    }

                    resolve(result);

                } else {
                    reject('undecoded')
                }

            } catch (err) {

                // if (err.name == 'TokenExpiredError') {
                //     resolve({
                //         status: 'expired'
                //     })
                // } else {
                reject(err)


            }
        });
    }

}

module.exports = service