const service = ({ jsonwebtoken, randToken, config }) => ({

    generateRefreshToken: async () => {

        const refreshToken = randToken.uid(128)

        return refreshToken

    },

    generateResetPassToken: async () => {

        const resetPassToken = randToken.uid(64) + 'gt'

        return resetPassToken

    },

    generateJwt: async (idUser) => {

        const payload = {
            uid: idUser,
            exp: Math.floor(Date.now() / 1000) + (60 * 2) // 2 minutes in milliseconds
        }
        const secret = config.app.secretAuth

        const options = {
            algorithm: 'HS256'
        }

        const token = jsonwebtoken.sign(payload, secret, options)

        return token

    },
    verifyJwt: async (token) => {

        const secret = config.app.secretAuth

        const decoded = jsonwebtoken.verify(token, secret)

        if (decoded) {

            return decoded

        } else {
            throw 'undecoded'
        }
    },
    decode: async (jwt) => {

        const secret = config.app.secretAuth

        const tokenDecoded = jsonwebtoken.verify(jwt, secret, {
            ignoreExpiration: true
        })

        if (!tokenDecoded) {
            throw 'undecoded'
        }

        const { uid, exp } = tokenDecoded

        let status

        const nowInSeconds = Math.floor(Date.now() / 1000)

        if (exp <= nowInSeconds) {

            status = 'expired'
        } else {
            status = 'active'
        }

        return { uid, status }

    }

})

module.exports = service