const expect = require('chai').expect
const sinon = require('sinon')

const userMock = require('../mocks/user.mock')
const userDbMock = require('../mocks/userdb.mock')

let authController = require('../../app/components/auth/auth.controller')
let userService = {}
let tokenService = {}
let emailService = {}
let user = {}
let service = {}

describe('Testing auth controller', () => {



    beforeEach('Prepare functions', function() {

        user = {...userDbMock }

        userService = {
            register: sinon.stub().withArgs("user@email.com", "user", "123456").resolves(user),
            authenticate: sinon.stub().withArgs("user@email.com", "123456").resolves(user),
            existsByEmail: sinon.stub().resolves(true),
            existsById: sinon.stub().resolves(true),
            existsByResetPassToken: sinon.stub().resolves(true),
            getByEmail: sinon.stub().withArgs("user@email.com").resolves(user),
            getByResetPassToken: sinon.stub().withArgs("resetpasstoken").resolves(user),
            storeResetPassToken: sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "resetpasstoken").resolves({ n: 1, nModified: 1, ok: 1 }),
            storeResfreshToken: sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "refreshtoken").resolves({ n: 1, nModified: 1, ok: 1 }),
            storeNewPassword: sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "123456").resolves({ n: 1, nModified: 1, ok: 1 }),
            isBlocked: sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(false),
            hasRefreshToken: sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(true),
            removeResetPassToken: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 })
        }

        tokenService = {
            generateRefreshToken: sinon.stub().resolves("refreshtoken"),
            generateResetPassToken: sinon.stub().resolves("refreshtoken"),
            generateJwt: sinon.stub().resolves("newjsonwebtoken"),
            decode: sinon.stub().withArgs("jsonwebtoken").resolves({ uid: "5e376c66ce68605aa0ed1149", status: "expired" })
        }

        emailService = {
            sendResetPassEmail: sinon.stub().withArgs("user@email.com", "user", "resetpasstoken").resolves({ response: "250 OK" })
        }

        controller = authController({ userService, tokenService, emailService })

    })

    it('Should call register function and return user registered', function(done) {

        controller.register("user@email.com", "user", "123456")
            .then(user => {

                expect(user.email).equals("user@email.com")

                done()
            })
            .catch(e => {
                done(e)
            })

    })

    it('Should call login function and return user with tokens', function(done) {

        controller.loginAndGenerateTokens("user@email.com", "123456")
            .then(result => {

                expect(result).to.be.include({ user: user })
                expect(result).to.be.include({ refresh: "refreshtoken" })
                expect(result).to.be.include({ jwt: "Bearer newjsonwebtoken" })

                done()
            })
            .catch(e => {
                done(e)
            })

    })

    it('Should return true if reset password', function(done) {

        controller.forgotPassword("user@email.com")
            .then(result => {

                expect(result).equals(true)
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should modify a user setting new password', function(done) {

        controller.recoveryPassword("resetpasstoken", "12345678")
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should generate a new json web token if valid refresh token exists', function(done) {

        controller.refreshTheJwt("5e376c66ce68605aa0ed1149", "Bearer jsonwebtoken", "refreshtoken")
            .then(result => {

                expect(result).equals("newjsonwebtoken")
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return user status "active"', function(done) {

        controller.verifyUser("5e376c66ce68605aa0ed1149", "refreshtoken")
            .then(result => {

                expect(result).to.be.include({ status: 'active' })
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return user status "inactive" if user is blocked', function(done) {

        userService.isBlocked = sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(true)

        controller = authController({ userService, tokenService, emailService })

        controller.verifyUser("5e376c66ce68605aa0ed1149", "refreshtoken")
            .then(result => {

                expect(result).to.be.include({ status: 'inactive' })
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return user status "inactive" if user has no refesh token', function(done) {

        userService.hasRefreshToken = sinon.stub().withArgs("5e376c66ce68605aa0ed1149", "refreshtoken").resolves(false)

        controller = authController({ userService, tokenService, emailService })

        controller.verifyUser("5e376c66ce68605aa0ed1149", "refreshtoken")
            .then(result => {

                expect(result).to.be.include({ status: 'inactive' })
                done()
            })
            .catch(e => {
                done(e)
            })
    })



    afterEach('Clean functions', function() {
        userService = {}
        passwordService = {}
        tokenService = {}
        emailService = {}
        user = {}
        service = {}
    })

})