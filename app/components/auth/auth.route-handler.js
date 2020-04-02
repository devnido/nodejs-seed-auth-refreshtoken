const handler = ({ authController }) => ({
    register: async(req, res, next) => {

        try {

            const { email, name, password } = req.body

            const user = await authController.register(email, name, password)

            if (!user) {
                next({ error: 'error en register', status: 500 })
                return
            }

            const response = {
                ok: true,
                content: {
                    message: 'Register Success',
                    user
                }
            }

            return res.status(200).json(response)

        } catch (error) {
            next({ error, status: 500 })
        }
    },
    login: async(req, res, next) => {

        try {

            const { email, password } = req.body

            const loginResult = await authController.loginAndGenerateTokens(email, password)

            if (!loginResult) {
                next({ error: 'invalid user or password', status: 401 })
                return
            }
            const { user, refresh, jwt } = loginResult

            if (refresh && jwt && user) {

                const response = {
                    ok: true,
                    content: { message: 'Login Success', user, jwt, refresh }
                }

                return res.status(200).json(response)
            } else {
                //next(err) status 
                next({ error: 'error en loginAndGenerateTokens ', status: 500 })
                return
            }
        } catch (err) {
            next(err)
        }
    },
    forgot: async(req, res, next) => {

        try {

            const { email } = req.body

            // result = { changeToken: kasjdkjasdjkaskdjsa }
            const result = await authController.forgotPassword(email)

            if (!result) {
                next({
                    error: 'Ocurrio un problema al enviar el email',
                    status: 500
                })
            }

            const response = {
                ok: true,
                content: {
                    message: 'Email enviado exitosamente'
                }
            }
            return res.status(200).json(response)

        } catch (err) {
            next({
                error: err,
                status: 401
            })
        }

    },
    recovery: async(req, res, next) => {

        try {

            const { resetToken } = req.params
            const { password } = req.body

            // result = { changeToken: kasjdkjasdjkaskdjsa }
            const result = await authController.recoveryPassword(resetToken, password)

            if (!result) {
                next({
                    error: 'Ocurrio un error al restablecer la contraseña',
                    status: 500
                })
            }

            const response = {
                ok: true,
                content: {
                    message: 'Contraseña restablecida exitosamente'
                }
            }
            return res.status(200).json(response)

        } catch (err) {
            next({
                error: err,
                status: 401
            })
        }

    },
    refresh: async(req, res, next) => {

        try {

            const bearer = req.headers.authorization

            const { idUser } = req.params

            const { refresh } = req.body

            // result = { newJwt: kasjdkjasdjkaskdjsa }
            const newJwt = await authController.refreshTheJwt(idUser, bearer, refresh)

            if (!newJwt) {
                next({
                    error: 'error en auth.route.refresh',
                    status: 500
                })
            }

            const response = {
                ok: true,
                content: {
                    message: 'Successful Refresh',
                    jwt: 'Bearer ' + newJwt
                }
            }

            return res.status(200).json(response)

        } catch (err) {
            next({
                error: err,
                status: 401
            })
        }

    },
    verify: async(req, res, next) => {

        try {

            const { refresh } = req.body

            const { idUser } = req.params

            // result = { status: 'inactive' || status: 'active' }
            const { status } = await authController.verifyUser(idUser, refresh)

            if (!status) {
                next({ error: 'error en auth.route.verify', status: 500 })
            }

            const response = {
                ok: true,
                content: {
                    message: 'Successful Verification',
                    status
                }
            }

            return res.status(200).json(response)


        } catch (err) {
            next({
                error: err,
                status: 401
            })
        }

    }

})

module.exports = handler