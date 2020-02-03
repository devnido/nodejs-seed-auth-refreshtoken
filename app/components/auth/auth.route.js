const authValidator = require('./auth.validator');
const authController = require('./auth.controller');

//TODO
// falta sanitizar el request que viene desde el cliente

const route = {
    init: (router) => {

        router.route('/register').post(
            authValidator.newUser,
            async (req, res, next) => {

                try {

                    const {
                        email,
                        name,
                        password
                    } = req.body;

                    const user = await authController.register(email, name, password);

                    if (user) {

                        const response = {
                            ok: true,
                            content: {
                                message: 'Register Success',
                                user: user
                            }
                        }


                        res.status(200).json(response);

                    } else {
                        //next(err) status 500
                        next({
                            error: 'error en registerAndLoginUserWithFacebook',
                            status: 500
                        });
                    }

                } catch (error) {
                    next({
                        error: err,
                        status: 500
                    })
                }


            });

        router.route('/login').post(
            authValidator.sanitizeUsername,
            async (req, res, next) => {

                try {

                    const {
                        email,
                        password
                    } = req.body;

                    const loginResult = await authController.loginAndGenerateTokens(email, password);

                    console.log(password);

                    if (loginResult) {

                        const {
                            user,
                            refreshToken,
                            jwt
                        } = loginResult;

                        if (refreshToken && jwt && user) {
                            req.jwt = jwt;
                            req.user = user;
                            req.refresh = refreshToken;
                            next();
                        } else {
                            //next(err) status 
                            next({
                                error: 'error en loginAndGenerateTokens ',
                                status: 500
                            });

                        }

                    } else {
                        next({
                            error: 'invalid user or password',
                            status: 401
                        });

                    }
                } catch (err) {

                    next(err);
                }
            },
            (req, res, next) => {
                if (req.jwt) {

                    const refresh = req.refresh;
                    const jwt = req.jwt;
                    const user = req.user

                    res.setHeader('Authorization', 'Bearer ' + jwt);
                    res.setHeader('Refresh', refresh);

                    const response = {
                        ok: true,
                        content: {
                            message: 'Login Success',
                            user: user
                        }
                    }

                    res.status(200).json(response);

                } else {
                    //next(err) status 500
                    next({
                        error: 'error en auth.route',
                        status: 500
                    })
                }
            });

        router.route('/refresh/:idUser').post(
            authValidator.sanitizeIdUser,
            //TODO: falta implementar la validacion y sanitizacion del header
            async (req, res, next) => {

                try {

                    const bearer = req.headers['authorization'];

                    const idUser = req.params.idUser;

                    const refreshToken = req.body.refreshToken;

                    // result = { newJwt: kasjdkjasdjkaskdjsa }
                    const { newJwt } = await authController.refreshTheToken(idUser, bearer, refreshToken);

                    req.jwt = newJwt;

                    next();

                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            },
            (req, res, next) => {

                if (req.jwt) {

                    const jwt = req.jwt;

                    console.log(jwt)

                    const response = {
                        ok: true,
                        content: {
                            message: 'Successful Refresh',
                            jwt: 'Bearer ' + jwt
                        }
                    }
                    res.status(200).json(response);

                } else {
                    //next(err) status 500
                    next({
                        error: 'error en auth.route.refresh',
                        status: 500
                    })
                }
            }
        );


        router.route('/verify/:idUser').post(
            authValidator.sanitizeIdUser,
            //TODO: falta implementar la validacion y sanitizacion del header
            async (req, res, next) => {

                try {

                    const refreshToken = req.headers['refresh'];

                    const idUser = req.params.idUser;

                    // result = { status: 'inactive' || status: 'active' }
                    const result = await authController.verifyUser(idUser, refreshToken);

                    req.status = result.status;

                    next();

                } catch (err) {
                    next({
                        error: err,
                        status: 401
                    })
                }

            },
            (req, res, next) => {

                if (req.status) {

                    const status = req.status;

                    console.log(status)

                    const response = {
                        ok: true,
                        content: {
                            message: 'verify success',
                            status: status
                        }
                    }
                    res.status(200).json(response);

                } else {
                    //next(err) status 500
                    next({
                        error: 'error en auth.route.verify',
                        status: 500
                    })
                }
            }
        );
    }
}

module.exports = route