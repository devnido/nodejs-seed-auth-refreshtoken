const service = ({ request, config }) => ({

    verifyCaptcha: async (captcha) => {

        const apiKey = config.recaptcha.key

        const urlVerify = `${config.recaptcha.site}?secret=${apiKey}&response=${captcha}`

        const result = await request({ url: urlVerify, method: 'POST', json: true })

        return result && result.success
    }

})

module.exports = service