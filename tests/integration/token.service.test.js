
const chai = require('chai');
const chaiJwt = require('chai-jwt');
chai.use(chaiJwt)
const { expect } = chai

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.testing') })

const jsonwebtoken = require('jsonwebtoken')
const randToken = require('rand-token')

const config = require('../../app/framework/config/env')
const tokenService = require('../../app/framework/services/token.service')

let service
let validJwt
let expiredJwt


describe('Testing token service - Integration Testing', () => {

    beforeEach('Prepare service', function () {
        service = tokenService({ jsonwebtoken, randToken, config })

        // generate expired jwt
        let exp = Math.floor(Date.now() / 1000) - 2
        let payload = { uid: 4, exp: exp }
        const secret = config.app.secretAuth
        const options = { algorithm: 'HS256' }
        expiredJwt = jsonwebtoken.sign(payload, secret, options)

        // generate valid jwt
        exp = Math.floor(Date.now() / 1000) + 8
        payload = { uid: 4, exp: exp }
        validJwt = jsonwebtoken.sign(payload, secret, options)

    })

    it('Should generate a string with random characters', function (done) {

        service.generateRefreshToken()
            .then(result => {
                expect(result).to.be.an('String')
                expect(result).to.have.lengthOf(128)
                done()
            })
            .catch(e => done(e))
    })

    it('Should generate a string with random characters and ends with gt', function (done) {

        service.generateResetPassToken()
            .then(result => {
                expect(result).to.be.an('String')
                expect(result).to.have.lengthOf(66)
                expect(result).to.be.contains('gt')
                done()
            })
            .catch(e => done(e))
    })

    it('Should generate jwt with id user', function (done) {

        const idUser = "45"

        service.generateJwt(idUser)
            .then(result => {
                expect(result).to.be.a.jwt
                expect(result).to.be.a.jwt.and.include({
                    uid: "45"
                })
                done()
            })
            .catch(e => done(e))
    })

    it('Should return the content of jwt', function (done) {

        const idUser = "45"

        service.generateJwt(idUser)
            .then(result => service.verifyJwt(result))
            .then(result => {
                expect(result).to.be.an('Object')
                expect(result).to.be.include({ uid: "45" })
                expect(result).to.have.property("exp")
                expect(result).to.have.property("iat")
                done()
            })
            .catch(e => done(e))


    })

    it('Should thow an error when jwt is expired', function (done) {

        service.verifyJwt(expiredJwt)
            .then(result => {

                done("error")
            })
            .catch(e => {
                expect(e).to.be.include({ name: 'TokenExpiredError', message: 'jwt expired' })
                done()
            })

    })

    it('Should thow an error when jwt is malformed', function (done) {

        service.decode("asdsad")
            .then(result => {
                done("error")
            })
            .catch(e => {
                expect(e).to.be.include({ name: 'JsonWebTokenError', message: 'jwt malformed' })
                done()
            })
    })

    it('Should return "expired" when jwt has expired', function (done) {

        service.decode(expiredJwt)
            .then(result => {
                expect(result).to.be.an('Object')
                expect(result).to.be.include({ uid: 4, status: 'expired' })
                done()
            })
            .catch(e => {

                done(e)
            })
    })

    it('Should return "active" when jwt has not expired', function (done) {
        service.decode(validJwt)
            .then(result => {
                expect(result).to.be.an('Object')
                expect(result).to.be.include({ uid: 4, status: 'active' })
                done()
            })
            .catch(e => {

                done(e)
            })
    })

    afterEach('Clean service', function () {
        service = null
        validJwt = null
        expiredJwt = null
    })

})
