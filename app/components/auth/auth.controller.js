const controller = ({ userService, tokenService, emailService }) => ({

    register: (email, name, password) => {

        return userService.register(email, name, password)

    },
    loginAndGenerateTokens: async(email, password) => {

        const [user, refreshToken] = await Promise.all([userService.authenticate(email, password), tokenService.generateRefreshToken()])

        if (!user) {
            return false
        }

        const [resultStore, jwt] = await Promise.all([userService.storeResfreshToken(user._id, refreshToken), tokenService.generateJwt(user._id)])

        return { user, refresh: refreshToken, jwt: 'Bearer ' + jwt }

    },
    forgotPassword: async(email) => {

        const [user, resetPassToken] = await Promise.all([userService.getByEmail(email), tokenService.generateResetPassToken()])

        const result = await userService.storeResetPassToken(user._id, resetPassToken);

        let resultSentEmail

        if (process.env.NODE_ENV !== 'testing') {
            resultSentEmail = await emailService.sendResetPassEmail(email, user.name, resetPassToken)
        } else {
            resultSentEmail = true
        }


        return (result && resultSentEmail)

    },
    recoveryPassword: async(resetPassToken, password) => {

        const user = await userService.getByResetPassToken(resetPassToken)

        const resultStore = await userService.storeNewPassword(user._id, password)

        const resultDelete = await userService.removeResetPassToken(user._id)

        return resultStore

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
        const isBlocked = await userService.isBlocked(idUser)

        let status;

        if (hasRefreshToken && !isBlocked) {
            status = 'active'
        } else {
            status = 'inactive'
        }
        return { status }
    }
})

module.exports = controller;