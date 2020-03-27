const jsonwebtoken = require('jsonwebtoken')
const randToken = require('rand-token')

const service = ({ config }) => ({

    generateRefreshToken: async() => {

        const refreshToken = randToken.uid(128)

        return refreshToken

    },

    generateResetPassToken: async() => {

        const resetPassToken = randToken.uid(64) + 'gt'

        return resetPassToken

    },

    generateJwt: async(idUser) => {

        const payload = {
            uid: idUser,
            exp: Date.now() + 1000 * 60 * 2 // 2 minutes in milliseconds
        }
        const secret = config.app.secretApi

        const options = {
            algorithm: 'HS256'
        }

        const token = jsonwebtoken.sign(payload, secret, options)

        return token

    },
    verifyJwt: async(token) => {

        const secret = config.app.secretApi

        const decoded = jsonwebtoken.verify(token, secret)

        if (decoded) {

            return decoded

        } else {
            throw 'undecoded'
        }
    },
    decode: async(jwt) => {

        const secret = config.app.secretApi

        const tokenDecoded = jsonwebtoken.verify(jwt, secret, {
            ignoreExpiration: true
        })

        const result = {}

        if (!tokenDecoded) {
            throw 'undecoded'
        }

        result.uid = tokenDecoded.uid

        if (tokenDecoded.exp <= Date.now()) {

            result.status = 'expired'
        } else {
            result.status = 'active'
        }

        return result

    }

})

module.exports = service