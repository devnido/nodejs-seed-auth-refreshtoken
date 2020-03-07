const userService = require('../users/user.service');
const tokenService = require('../../framework/services/token.service');

const controller = {
    register: (email, name, password) => {

        return userService.register(email, name, password)

    },
    loginAndGenerateTokens: async(email, password) => {

        const [user, refeshToken] = await Promise.all(userService.authenticate(email, password), tokenService.generateRefreshToken())

        if (!user) {
            return false
        }

        const [userWithRefreshToken, jwt] = await Promise.all(userService.storeResfreshToken(user._id, refeshToken), tokenService.generateJwt(user._id))

        return { user, refreshToken, jwt }

    },
    refreshTheJwt: async(idUser, bearer, refreshToken) => {

        const jwt = bearer.split(' ')[1];

        const { uid, status } = await tokenService.decode(jwt)

        const userHasRefreshToken = await userService.hasRefreshToken(uid, refreshToken)

        if (status !== 'expired') {
            throw 'El token no ha expirado'
        }
        if (!userHasRefreshToken) {
            throw 'Refresh token no pertenece al usuario'
        }
        if (uid !== idUser) {
            throw 'El usuario es un impostor'
        }

        const newJwt = await tokenService.generateJwt(uid);

        return newJwt;

    },
    verifyUser: async(idUser, refreshToken) => {

        const hasRefreshToken = await userService.hasRefreshToken(idUser, refreshToken)

        let = status;

        if (hasRefreshToken) {
            status = 'active'
        } else {
            status = 'inactive'
        }
        return { status }
    }
}

module.exports = controller;