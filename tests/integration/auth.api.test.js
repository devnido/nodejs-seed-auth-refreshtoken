const { expect } = require('chai')
const request = require('supertest')

const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.testing') })

const { app } = require('../../app/framework/startup/app')
const { db, string, options } = require('../../app/framework/database/db.connect')
const config = require('../../app/framework/config/env')

const User = require('../../app/components/users/user.model')

let expiredJwt
let userDB
let server

describe('Testing Auth API Rest - Integration Tests', () => {

    before('database connect', function (done) {

        db.connect(string, options)
            .then(() => {
                server = app.listen(3000, () => {

                    const exp = Math.floor(Date.now() / 1000) - 2
                    const payload = { uid: "5e376c66ce68605aa0ed1152", exp }
                    const secret = config.app.secretAuth
                    const options = { algorithm: 'HS256' }
                    expiredJwt = `Bearer ${jsonwebtoken.sign(payload, secret, options)}`

                    done()
                })
            })
            .catch(e => done(e))

    })

    beforeEach('populate users collection', function (done) {

        userDB = {
            _id: "5e376c66ce68605aa0ed1152",
            email: "admin@admin.com",
            name: "admin user",
            password: bcrypt.hashSync("123456", 8),
            status: "active",
            resetPassToken: "resetpasstoken",
            resetPassTokenExpDate: Date.now() + 1000 * 60 * 2, // 2 minutes in milliseconds
            refreshToken: "refreshtoken",
            refreshTokenExpDate: Date.now() + 1000 * 60 * 2 // 2 minutes in milliseconds
        }

        userDB2 = {
            _id: "5e376c66ce68605aa0ed1154",
            email: "admin@admin.com",
            name: "admin user",
            password: bcrypt.hashSync("123456", 8),
            status: "active",
            resetPassToken: "resetpasstoken",
            resetPassTokenExpDate: Date.now() + 1000 * 60 * 2, // 2 minutes in milliseconds
            refreshToken: "expiredrefreshtoken",
            refreshTokenExpDate: Date.now() // expired refeshtoken2
        }

        User.insertMany([userDB, userDB2])
            .then(result => {
                done()
            })
            .catch(e => {
                done(e)
            })

    })

    describe('POST /register', () => {

        const user = {
            name: "test name",
            email: "test@gmail.com",
            password: "123456",
            confirmPassword: "123456",
            captcha: ""
        }

        it('Should return status 200 and the registered user', function (done) {

            request(server)
                .post('/api/v1/register')
                .send(user)
                .expect(200)
                .then(resp => {
                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).equals('Register Success')
                    expect(resp.body.content.user).to.be.include({ name: 'test name', email: 'test@gmail.com', password: ':)' })
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

        it('Should return status 422 and validation errors - invalid email', function (done) {

            const newUser = { ...user }
            newUser.email = 'emailincorrecto'
            request(server)
                .post('/api/v1/register')
                .send({ ...newUser })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('email')
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

        it('Should return status 422 and validation errors - email already exists', function (done) {

            const newUser = { ...user }
            newUser.email = 'admin@admin.com'
            request(server)
                .post('/api/v1/register')
                .send({ ...newUser })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('email')
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

    })

    describe('POST /login', () => {

        it('Should return status 200 and user, resfresh token, json web token', function (done) {

            request(server)
                .post('/api/v1/login')
                .send({ email: "admin@admin.com", password: "123456", captcha: "" })
                .expect(200)
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    const { message, user, refresh, jwt } = resp.body.content
                    expect(message).equals('Login Success')
                    expect(user).to.include({ name: 'admin user', status: 'active', email: 'admin@admin.com' })
                    expect(user).to.not.have.property('password')
                    expect(refresh).to.be.an("String")
                    expect(jwt).to.be.an("String")
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

        it('Should return status 422 and validation errors - invalid email', function (done) {

            request(server)
                .post('/api/v1/login')
                .send({ email: "asdasdsadas", password: "123456", captcha: "" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('email')
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

        it('Should return status 401 Unauthorized - invalid login', function (done) {

            request(server)
                .post('/api/v1/login')
                .send({ email: "admin@jsakdsad.com", password: "123456", captcha: "" })
                .expect(401)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unauthorized')
                    expect(resp.body.content.error.message).equals("you don't have permission to access")
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })
    })

    describe('POST /forgot', () => {


        it('Should return status 200 and success message', function (done) {

            request(server)
                .post('/api/v1/forgot')
                .send({ email: "admin@admin.com", captcha: "" })
                .expect(200)
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).to.be.equals('Email enviado exitosamente')



                    done()
                })
                .catch(e => {
                    done(e)
                })

        })

        it('Should return status 422 and validation errors - invalid email', function (done) {

            request(server)
                .post('/api/v1/forgot')
                .send({ email: "asdasdsadas", captcha: "" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('email')
                    done()
                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 422 Unauthorized - user does not exists', function (done) {

            request(server)
                .post('/api/v1/forgot')
                .send({ email: "admin@jsakdsad.com", captcha: "" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('email')
                    done()
                })
                .catch(e => {
                    done(e)
                })

        })
    })

    describe('POST /recovery/:resetToken', () => {

        it('Should return status 200 and success message', function (done) {

            request(server)
                .post('/api/v1/recovery/resetpasstoken')
                .send({ password: "qwerty", confirmPassword: "qwerty", captcha: "" })
                .expect(200)
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).equals('Contraseña restablecida exitosamente')

                    return request(server)
                        .post('/api/v1/login')
                        .send({ email: "admin@admin.com", password: "qwerty", captcha: "" })
                        .expect(200)

                })
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    const { message, user, refresh, jwt } = resp.body.content
                    expect(message).equals('Login Success')
                    expect(user).to.include({ name: 'admin user', status: 'active', email: 'admin@admin.com' })
                    expect(user).to.not.have.property('password')
                    expect(refresh).to.be.an("String")
                    expect(jwt).to.be.an("String")
                    done()

                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 422 and validation errors - passwords are not equals', function (done) {

            request(server)
                .post('/api/v1/recovery/resetpasstoken')
                .send({ password: "qwerty", confirmPassword: "ytrewq", captcha: "" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('password')
                    done()

                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 422 and validation errors - invalid reset pass token', function (done) {

            request(server)
                .post('/api/v1/recovery/invalidresetpasstoken')
                .send({ password: "qwerty", confirmPassword: "qwerty", captcha: "" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('resetToken')
                    done()

                })
                .catch(e => {
                    done(e)
                })

        })
    })

    describe('POST /refresh/:idUser', () => {

        it('Should return status 200 and success message', function (done) {

            request(server)
                .post('/api/v1/refresh/5e376c66ce68605aa0ed1152')
                .set("authorization", expiredJwt)
                .send({ refresh: "refreshtoken" })
                .expect(200)
                .then(resp => {
                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).equals('Successful Refresh')
                    expect(resp.body.content.jwt).to.be.an('String')

                    done()
                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 422 and validation errors - user does not exists', function (done) {

            request(server)
                .post('/api/v1/refresh/5e376c66ce68605aa0ed1144')
                .set("authorization", expiredJwt)
                .send({ refresh: "refreshtoken" })
                .expect(422)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unprocessable Entity')
                    expect(resp.body.content.error.message).equals('Request with Validation Errors')
                    expect(resp.body.content.error.errors[0].param).equals('idUser')
                    done()

                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 401 Unauthorized - refresh token does not belong to user', function (done) {

            request(server)
                .post('/api/v1/refresh/5e376c66ce68605aa0ed1152')
                .set("authorization", expiredJwt)
                .send({ refresh: "invalidrefreshtoken" })
                .expect(401)
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unauthorized')
                    expect(resp.body.content.error.message).equals("you don't have permission to access")
                    done()

                })
                .catch(e => {
                    done(e)
                })
        })

        it('Should return status 401 and validation errors - jwt has not expired', function (done) {

            let jwtNotExpired

            request(server)
                .post('/api/v1/login')
                .send({ email: "admin@admin.com", password: "123456", captcha: "" })
                .expect(200)
                .then(resp => {

                    jwtNotExpired = resp.body.content.jwt

                    return request(server)
                        .post('/api/v1/refresh/5e376c66ce68605aa0ed1152')
                        .set("authorization", jwtNotExpired)
                        .send({ refresh: "refreshtoken" })
                        .expect(401)

                })
                .then(resp => {
                    expect(resp.body.ok).equals(false)
                    expect(resp.body.content.error).to.be.an('Object')
                    expect(resp.body.content.error.type).equals('Unauthorized')
                    expect(resp.body.content.error.message).equals("you don't have permission to access")
                    done()
                }).catch(e => {
                    done(e)
                })
        })

    })

    describe('POST /verify/:idUser', () => {

        it('Should return status 200 and status active', function (done) {

            request(server)
                .post('/api/v1/verify/5e376c66ce68605aa0ed1152')
                .send({ refresh: "refreshtoken" })
                .expect(200)
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).equals('Successful Verification')
                    expect(resp.body.content.status).equals('active')

                    done()

                }).catch(e => {
                    done(e)
                })
        })

        it('Should return status 200 and status inactive when refresh token has expired', function (done) {

            request(server)
                .post('/api/v1/verify/5e376c66ce68605aa0ed1154')
                .send({ refresh: "expiredrefreshtoken" })
                .expect(200)
                .then(resp => {

                    expect(resp.body.ok).equals(true)
                    expect(resp.body.content).to.be.an('Object')
                    expect(resp.body.content.message).equals('Successful Verification')
                    expect(resp.body.content.status).equals('inactive')

                    done()

                }).catch(e => {
                    done(e)
                })
        })

    })

    afterEach('clean articles collection', function (done) {

        userDB = {}

        User.deleteMany({})
            .then(result => {
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    after('database disconnect', function (done) {

        expiredJwt = ''
        db.disconnect()
            .then(() => {
                server.close(() => {
                    done()
                })
            })
            .catch(err => {
                done(err)
            })
    })

})