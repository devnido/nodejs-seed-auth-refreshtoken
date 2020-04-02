const nodemailer = require('nodemailer')

const service = ({ config, emailTemplate }) => ({

    sendResetPassEmail: async(emailTo, name, resetPassToken) => {

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

        const resultEmailSent = await transporter.sendMail({
            from: `${config.email.name} <${config.email.from}>`,
            to: emailTo,
            subject: subject,
            html: contentHTML
        })

        return resultEmailSent.response.includes('250 OK')

    }

})

module.exports = service;