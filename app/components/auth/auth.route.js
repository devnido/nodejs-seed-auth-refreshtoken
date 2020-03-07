const authValidator = require('./auth.validator');
const authController = require('./auth.controller');

//TODO
// falta sanitizar el request que viene desde el cliente

const route = {
    init: (router) => {

        router.route('/register').post(
            authValidator.register,
            async(req, res, next) => {

                try {

                    const { email, name, password } = req.body;

                    const user = await authController.register(email, name, password);

                    if (!user) {
                        next({ error: 'error en register', status: 500 });
                    }

                    const response = {
                        ok: true,
                        content: {
                            message: 'Register Success',
                            user: user
                        }
                    }

                    res.status(200).json(response);

                } catch (error) {
                    next({ error: err, status: 500 })
                }

            })

        router.route('/login').post(
            authValidator.login,
            async(req, res, next) => {

                try {

                    const { email, password } = req.body;

                    const loginResult = await authController.loginAndGenerateTokens(email, password);

                    if (!loginResult) {
                        next({ error: 'invalid user or password', status: 401 });
                    }

                    const { user, refreshToken, jwt } = loginResult;

                    if (refreshToken && jwt && user) {

                        res.setHeader('Authorization', 'Bearer ' + jwt);
                        res.setHeader('Refresh', refreshToken);

                        const response = {
                            ok: true,
                            content: { message: 'Login Success', user: user }
                        }

                        res.status(200).json(response);
                    } else {
                        //next(err) status 
                        next({ error: 'error en loginAndGenerateTokens ', status: 500 });
                    }
                } catch (err) {
                    next(err);
                }
            })

        router.route('/forgot').post(
            authValidator.forgotPassword,
            async(req, res, next) => {

                try {

                    const { email } = req.body;

                    // result = { changeToken: kasjdkjasdjkaskdjsa }
                    const result = await authController.forgotPassword(email);

                    if (typeof result === 'undefined') {
                        next({
                            error: 'error en auth.route.forgot',
                            status: 500
                        })
                    }

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
                    res.status(200).json(response);

                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            })

        router.route('/recovery/:resetToken').post(
            authValidator.recoveryPassword,
            async(req, res, next) => {

                try {

                    const { resetToken } = req.params;
                    const { password } = req.body;

                    // result = { changeToken: kasjdkjasdjkaskdjsa }
                    const result = await authController.recoveryPassword(resetToken, password);

                    if (typeof result === 'undefined' || !result) {
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
                    res.status(200).json(response);

                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            })

        router.route('/refresh/:idUser').post(
            authValidator.refreshTheJwt,
            async(req, res, next) => {

                try {

                    const bearer = req.headers['authorization'];

                    const idUser = req.params.idUser;

                    const refreshToken = req.body.refreshToken;

                    // result = { newJwt: kasjdkjasdjkaskdjsa }
                    const newJwt = await authController.refreshTheJwt(idUser, bearer, refreshToken);

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
                            jwt: 'Bearer ' + jwt
                        }
                    }
                    res.status(200).json(response);

                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            })

        router.route('/verify/:idUser').post(
            authValidator.sanitizeIdUser,
            async(req, res, next) => {

                try {

                    const { refresh } = req.headers

                    const { idUser } = req.params

                    // result = { status: 'inactive' || status: 'active' }
                    const result = await authController.verifyUser(idUser, refreshToken);

                    if (!result) {
                        next({ error: 'error en auth.route.verify', status: 500 })
                    }

                    const response = {
                        ok: true,
                        content: {
                            message: 'verify success',
                            status: status
                        }
                    }

                    res.status(200).json(response);


                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            })

    }
}

module.exports = route