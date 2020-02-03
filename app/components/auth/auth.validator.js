const errorHandler = require('../../framework/middlewares/error-handler.middleware');

const {
    check,
    body,
    param,
    validationResult
} = require('express-validator')


const validator = {
    newUser: [
        check(['email', 'name']).trim().escape(),
        body('email').isEmail().withMessage('must be a valid email'),
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
            }).withMessage('Debe contener como minimo 6 caracteres'),
        errorHandler.validation(validationResult)

    ],
    sanitizeUsername: [
        check('email').trim().escape(),
        body('email').isEmail().withMessage('User must be a valid email'),
        errorHandler.validation(validationResult)
    ],
    sanitizeIdUser: [
        check('idUser').trim().escape(),
        param('idUser').isMongoId().withMessage('idUser must be a valid Id'),
        errorHandler.validation(validationResult)
    ]
}



module.exports = validator;