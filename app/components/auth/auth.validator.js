const { check, body, param, validationResult, header } = require('express-validator')

const validator = ({ errorHandler, userService, recaptchaService }) => ({
    register: [
        check(['email', 'name']).trim().escape(),

        body('email').isEmail().withMessage('El email debe ser válido')
        .custom((email) => {
            return userService.existsByEmail(email)
                .then(result => {
                    console.log(result);

                    if (result) {
                        return Promise.reject('El email ya está registrado')
                    } else {
                        return result
                    }
                })
                .catch(err => {
                    throw new Error(err);
                })
        }).withMessage('El email ya está registrado'),

        body('name')
        .exists({
            checkFalsy: true
        }).withMessage('name is required')
        .isLength({
            min: 2,
            max: 50
        }).withMessage('Debe contener entre 2 y 50 caracteres')
        .matches('^[a-zA-Z0-9][a-zA-Z\\s\\d]*$').withMessage('El nombre solo puede contener letras y números'),

        body('password')
        .exists({
            checkFalsy: true
        }).withMessage('La contraseña es obligatoria')
        .isLength({
            min: 6
        }).withMessage('Debe contener como minimo 6 caracteres')
        .custom((password, { req }) => {
            if (password !== req.body.confirmPassword) {
                // trow error if passwords do not match
                throw new Error("Nueva contraseña y Confirmar contraseña deben ser iguales");
            } else {
                return password;
            }
        }),

        body('captcha')
        .exists().withMessage('email is obligatorio')
        .custom((captcha) => {
            return captchaService.verifyCaptcha(captcha)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El captcha es incorrecto')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El captcha es incorrecto'),

        errorHandler.validation(validationResult)

    ],
    login: [
        check(['email', 'captcha']).trim().escape(),

        body('email').isEmail().withMessage('User must be a valid email'),
        check('password').trim(),

        body('captcha')
        .exists().withMessage('email is obligatorio')
        .custom((captcha) => {
            return captchaService.verifyCaptcha(captcha)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El captcha es incorrecto')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El captcha es incorrecto'),



        errorHandler.validation(validationResult)
    ],
    forgotPassword: [
        check('email').trim().escape(),
        body('email').isEmail().withMessage('El email ingresado no es válido')
        .exists({
            checkFalsy: true
        }).withMessage('email is required')
        .custom((email) => {
            return userService.existsByEmail(email)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El email no existe')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El email no existe'),

        body('captcha')
        .exists().withMessage('email is obligatorio')
        .custom((captcha) => {
            return captchaService.verifyCaptcha(captcha)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El captcha es incorrecto')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El captcha es incorrecto'),

        errorHandler.validation(validationResult)
    ],
    recoveryPassword: [

        check('resetToken').trim().escape(),

        param('resetToken')
        .exists({
            checkFalsy: true
        }).withMessage('El token es requerido')
        .custom((resetToken) => {
            return userService.existsByResetPassToken(resetToken)
                .then(result => {
                    if (result) {} else {
                        return Promise.reject('El token no es válido')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El token no es válido'),

        body('confirmPassword')
        .exists({
            checkFalsy: true
        }).withMessage('La confirmacion de la contraseña es obligatoria')
        .isLength({
            min: 6
        }).withMessage('Debe contener como minimo 6 caracteres'),

        body('password')
        .exists({
            checkFalsy: true
        }).withMessage('La contraseña es obligatoria')
        .isLength({
            min: 6
        }).withMessage('Debe contener como minimo 6 caracteres')
        .custom((password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error("Las contraseñas no coinciden");
            } else {
                return password;
            }
        }),

        body('captcha')
        .exists().withMessage('email is obligatorio')
        .custom((captcha) => {
            return captchaService.verifyCaptcha(captcha)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El captcha es incorrecto')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El captcha es incorrecto'),

        errorHandler.validation(validationResult)
    ],
    refreshTheJwt: [
        check(['idUser', 'refresh', 'authorization']).trim().escape(),

        param('idUser').isMongoId().withMessage('El id del usuario no es válido')
        .custom((idUser) => {
            return userService.existsById(idUser)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El usuario no existe')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El email no existe'),

        body('refresh')
        .exists({
            checkFalsy: true
        }).withMessage('El refresh token es obligatorio'),

        errorHandler.validation(validationResult)

    ],
    verifyUser: [
        check(['idUser', 'refresh']).trim().escape(),

        param('idUser').isMongoId().withMessage('El id del usuario no es válido')
        .custom((idUser) => {
            return userService.existsById(idUser)
                .then(result => {
                    if (result) {

                    } else {
                        return Promise.reject('El usuario no existe')
                    }
                })
                .catch(err => {

                    throw new Error(err);
                })
        }).withMessage('El email no existe'),

        errorHandler.validation(validationResult)
    ]
})



module.exports = validator;