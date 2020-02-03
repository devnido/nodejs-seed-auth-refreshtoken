const error = {
    validation: (validationResult) => {

        const validation = (req, res, next) => {

            const errorFormatter = ({
                location,
                msg,
                param,
                value,
                nestedErrors
            }) => {
                // Build your resulting errors however you want! String, object, whatever - it works!

                return `${location}[${param}]: ${msg} -> '${value}'`;
            };

            const errors = validationResult(req).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                next({
                    error: errors.array({
                        onlyFirstError: true
                    }),
                    status: 422
                })
            } else {
                next()
            }

        }

        return validation;
    },
    bodyParser: (err, req, res, next) => {
        console.log(err);

        if (err instanceof SyntaxError) {
            next({
                error: err,
                status: 400
            })
        } else {
            next();
        }

    },
    log: (err, req, res, next) => {
        // const error = err.error;
        // const status = err.status;
        //loguear error
        // if (process.env.NODE_ENV == 'development') {
        console.log(err);
        //}

        next(err)
    },
    handler: (err, req, res, next) => {

        const error = err.error;
        let status = err.status ? err.status : 500; //500 por defecto

        const response = {};

        if (status === 401) {

            status = 401;
            response.ok = false;
            response.content = {
                error: {
                    type: 'Unauthorized',
                    message: 'you don\'t have permission to access'
                }
            }

        } else if (status === 440) {

            status = 401;
            response.ok = false;
            response.content = {
                error: {
                    type: 'Session Expired',
                    message: 'you don\'t have permission to access'
                }
            }

        } else if (status === 422) {

            status = 422;
            response.ok = false;
            response.content = {
                error: {
                    type: 'Unprocessable Entity',
                    message: 'Request with Validation Errors',
                    errors: error

                }
            }

        } else if (status === 400) {
            status = 400;
            response.ok = false;
            response.content = {
                error: {
                    type: 'Bad Request',
                    message: 'Malformed request data'

                }
            }
        } else {
            //para cualquier otro status asume 500 por defecto
            response.ok = false;
            response.content = {
                error: {
                    type: 'Internal Server Error',
                    message: 'Ups! something\'s wrong'
                }
            }
        }

        res.status(status)
            .json(response);
    },
    notFound: (req, res) => {

        const status = 404;
        const response = {};

        response.ok = false;
        response.content = {
            error: {
                type: 'Not Found',
                message: 'The requested resource could not be found'
            }
        }
        res.status(status)
            .json(response);
    }
}

module.exports = error