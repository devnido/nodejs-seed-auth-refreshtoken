const nodemailer = require('nodemailer');
const config = require('../config/env')
const fs = require('fs');
const path = require('path');

const service = {

    sendResetPassEmail: (emailTo, name, resetPassToken) => {

        const baseUrl = config.app.baseUrl;

        const contentHTML = getTemplateResetPassword(name, baseUrl, resetPassToken);

        const subjet = 'Solicitud Nueva Contraseña';

        return sendMail(emailTo, subjet, contentHTML);

    }

}

module.exports = service;

function getTemplateResetPassword(name, baseUrl, resetPassToken) {
    const contentHTML = `        
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    </head>
    <body>
    <h1>Hola ${name},</h1>
    <p>Recientemente has solicitado un cambio de contraseña para ingresar al sistema. </p>
<br>
    <p>Haz click en el siguiente enlace:  <a href="${baseUrl}/#/recovery/${resetPassToken}">Restablecer Contraseña</a></p>
    <br>
    <p>Si no puedes hacer click en el enlace por favor copia esta URL en el navegador web ${baseUrl}/#/recovery/${resetPassToken}</p>
       
    <br>
        <p>Si tu no solicitaste un cambio de contraseña, por favor ignora este email</p>
        
        <p>Sistema de prueba</p>
    </body>
    </html>`;

    return contentHTML;
}


async function sendMail(emailTo, subject, contentHTML) {

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


    const result = await transporter.sendMail({
        from: `${config.email.name} <${config.email.from}>`,
        to: emailTo,
        subject: subject,
        html: contentHTML
    })

    return result;

}