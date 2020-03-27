const nodemailer = require('nodemailer')

const service = ({ config, emailTemplate }) => ({

    sendResetPassEmail: (emailTo, name, resetPassToken) => {

        const baseUrl = config.app.baseUrl

        const contentHTML = emailTemplate.getResetPassword(name, baseUrl, resetPassToken)

        const subjet = 'Solicitud Nueva Contraseña'

        const transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: false,
            auth: {
                user: config.email.user,
                pass: config.email.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        return transporter.sendMail({
            from: `${config.email.name} <${config.email.from}>`,
            to: emailTo,
            subject: subject,
            html: contentHTML
        })

    }

})

module.exports = service;