const { expect } = require('chai')

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.testing') })

const request = require('request-promise-native')

const config = require('../../app/framework/config/env')
const reCaptchaService = require('../../app/framework/services/recaptcha.service')

let service = reCaptchaService({ request, config })

describe('Testing reCaptcha service - Integration Testing', () => {

    it('Should verify captcha key with Google', function(done) {

        service.verifyCaptcha("")
            .then(result => {
                expect(result).equal(true)
                done()
            })
            .catch(e => done(e))
    })


})