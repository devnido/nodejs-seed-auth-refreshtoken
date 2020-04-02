const expect = require('chai').expect
const sinon = require('sinon')

const userMock = require('../mocks/user.mock')
const userDbMock = require('../mocks/userdb.mock')

let authRouteHandler = require('../../app/components/auth/auth.route-handler')
let authController = {}
let user = {}
let routeHandler = {}

describe('Testing auth controller', () => {

    beforeEach('Prepare functions', function() {

        user = {...userDbMock }

        authController = {
            register: sinon.stub().withArgs("user@email.com", "user", "123456").resolves(user),
            loginAndGenerateTokens: sinon.stub().withArgs("user@email.com", "123456").resolves({ user, refresh: "refreshtoken", jwt: "Bearer jsonwebtoken" }),
            forgotPassword: sinon.stub().withArgs("user@email.com").resolves(true),
            recoveryPassword: sinon.stub().withArgs("resetpasstoken", "123456").resolves({ n: 1, nModified: 1, ok: 1 }),
            refreshTheJwt: sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "Bearer jsonwebtoken", "refreshtoken").resolves("newjsonwebtoken"),
            verifyUser: sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "refreshtoken").resolves({ status: "active" })
        }

        req = {
            headers: { authorization: "Bearer jsonwebtoken" },
            params: { idUser: "5e376c66ce68605aa0ed1149", resetToken: "resetpasstoken" },
            body: { email: "user@email.com", name: "user", password: "123456", refesh: "refreshtoken" }
        }

        res = (() => {
            const resMock = {}
            resMock.status = sinon.stub().returns(resMock)
            resMock.json = sinon.stub().returns(resMock)
            return resMock
        })()

        next = sinon.stub()

        routeHandler = authRouteHandler({ authController })

    })


    it('Should return status 200 and response with register used', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Register Success',
                user
            }
        }

        routeHandler.register(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))

    })

    it('Should return status 200 and response with logged user ', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Login Success',
                user,
                jwt: "Bearer jsonwebtoken",
                refresh: "refreshtoken"
            }
        }

        routeHandler.login(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))
    })

    it('Should return status 200 and response with a message email sent ', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Email enviado exitosamente'
            }
        }

        routeHandler.forgot(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))
    })

    it('Should return status 200 and response with a message password reset', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Contraseña restablecida exitosamente'
            }
        }

        routeHandler.recovery(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))
    })

    it('Should return status 200 and response with a new json web token', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Successful Refresh',
                jwt: 'Bearer newjsonwebtoken'
            }
        }

        routeHandler.refresh(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))
    })

    it('Should return status 200 and response with user status', function(done) {

        const response = {
            ok: true,
            content: {
                message: 'Successful Verification',
                status: 'active'
            }
        }

        routeHandler.verify(req, res, next)
            .then(result => {

                expect(res.status.calledWith(200)).equals(true)

                expect(res.json.calledWith(response)).equals(true)

                done()
            })
            .catch(e => done(e))
    })

    afterEach('Clean functions', function() {
        authController = {}
        user = {}
        routeHandler = {}
        req = {}
        res = {}
        next = {}
    })

})