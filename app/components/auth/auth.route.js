const route = ({ authValidator, authRouteHandler }) => ({
    init: (router) => {

        router.route('/register').post(authValidator.register, authRouteHandler.register)

        router.route('/login').post(authValidator.login, authRouteHandler.login)

        router.route('/forgot').post(authValidator.forgotPassword, authRouteHandler.forgot)

        router.route('/recovery/:resetToken').post(authValidator.recoveryPassword, authRouteHandler.recovery)

        router.route('/refresh/:idUser').post(authValidator.refreshTheJwt, authRouteHandler.refresh)

        router.route('/verify/:idUser').post(authValidator.verifyUser, authRouteHandler.verify)

    }
})

module.exports = route