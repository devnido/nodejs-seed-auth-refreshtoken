const expect = require('chai').expect
const sinon = require('sinon')

const userMock = require('../mocks/user.mock')
const userDbMock = require('../mocks/userdb.mock')

let userService = require('../../app/components/users/user.service')
let userRepository = {}
let passwordService = {}
let user = {}
let service = {}

describe('Testing User Service - Unit Tests', () => {


    beforeEach('Prepare functions', function() {

        user = {...userDbMock }
        user.toObject = () => user

        userRepository = {
            existsByEmail: sinon.stub().resolves(true),
            existsById: sinon.stub().resolves(true),
            existsByValidResetPassToken: sinon.stub().resolves(true),
            getById: sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(user),
            getByEmail: sinon.stub().withArgs("user@email.com").resolves(user),
            getByIdWithRefreshToken: sinon.stub().withArgs("asdasdasdasdasdadada").resolves(user),
            getByResetPassToken: sinon.stub().withArgs("asdasdasdasdasdadada").resolves(user),
            insert: sinon.stub().returns(user),
            getToAuthenticate: sinon.stub().withArgs("user@email.com").resolves(user),
            setRefreshToken: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 }),
            setResetPassToken: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 }),
            setNewPassword: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 }),
            removeResetPassToken: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 }),
            removeRefreshToken: sinon.stub().resolves({ n: 1, nModified: 1, ok: 1 }),
            delete: sinon.stub().resolves({ n: 1, deletedCount: 1, ok: 1 }),
        }

        passwordService = {
            generateRandomPassword: sinon.stub().returns('ashdajshdjka'),
            comparePassword: sinon.stub().withArgs('123456', '123456').returns(true),
            hashPassword: sinon.stub().withArgs('123546').returns('jasdhjsadhjash')
        }

        service = userService({ userRepository, passwordService })

    })

    it('Should register a user', function(done) {

        service.register(user.email, user.name, user.password)
            .then(userAdded => {

                expect(userAdded).to.be.include({ _id: user._id })

                expect(userAdded).to.be.include({ password: ':)' })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should authenticate a user', function(done) {

        service.authenticate(user.email, user.password)
            .then(userAuthenticated => {

                expect(userAuthenticated).to.be.include({ _id: user._id })

                expect(userAuthenticated).to.be.include({ status: 'active' })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return true if user exists by email', function(done) {
        service.existsByEmail(user.email)
            .then(result => {
                expect(result).equals(true)
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return true if user exists by id', function(done) {
        service.existsById(user._id)
            .then(result => {
                expect(result).equals(true)
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return true if user exists by reset pass token', function(done) {

        user.resetPassToken = "ajsdjkasj"

        service.existsByResetPassToken(user.resetPassToken)
            .then(result => {
                expect(result).equals(true)
                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return a user if find by email', function(done) {

        service.getByEmail(user.email)
            .then(userResult => {

                expect(userResult).to.be.include({ _id: user._id })

                expect(userResult).to.be.include({ status: 'active' })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return a user if find by reset pass token', function(done) {

        user.resetPassToken = "asdasdasdasdasdadada"

        service.getByResetPassToken(user.resetPassToken)
            .then(userResult => {
                expect(userResult).to.be.include({ _id: user._id })

                expect(userResult).to.be.include({ status: 'active' })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should modify a user setting new reset pass token', function(done) {

        user.resetPassToken = "asdasdasdasdasdadada"

        service.storeResetPassToken(user._id, user.resetPassToken)
            .then(result => {
                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should modify a user setting new refresh token', function(done) {

        user.refreshToken = "asdasdasdasdasdadada"

        service.storeResetPassToken(user._id, user.refreshToken)
            .then(result => {
                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return false if user status is active', function(done) {

        service.isBlocked(user._id)
            .then(result => {

                expect(result).equals(false)

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return true if user status is blocked', function(done) {

        user.status = 'blocked'

        userRepository.getById = sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(user)

        service = userService({ userRepository, passwordService })

        service.isBlocked(user._id)
            .then(result => {

                expect(result).equals(true)

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return true if user has a refresh token', function(done) {

        refreshToken = 'cYVCc3DLN3YmZ9Ws369m7pRxvF5jFheEdelMOfeI3K6ev0TBHlAnqNGGeoSTHDir9Y5GPfxn2deMT20Mz0uOT85z6UiDMwzPeyapmTI0oMRUAes2tzlrB6Ds7d2AunZP'

        userRepository.getByIdWithRefreshToken = sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(user)

        service = userService({ userRepository, passwordService })

        service.hasRefreshToken(user._id, refreshToken)
            .then(result => {

                expect(result).equals(true)

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should return false if user has no refresh token', function(done) {

        refreshToken = 'cYVCc3DLN3YmZ9Ws369m7pRxvF5jFheEdelMOfeI3K6ev0TBHlAnqNGGeoSTHDir9Y5GPfxn2deMT20Mz0uOT85z6UiDMwzPeyapmTI0oMRUAes2tzlrB6Ds7d2AunZP'

        user.refreshToken = ''

        userRepository.getByIdWithRefreshToken = sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(user)

        service = userService({ userRepository, passwordService })

        service.hasRefreshToken(user._id, refreshToken)
            .then(result => {

                expect(result).equals(false)

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    it('Should modify a user removing reset pass token', function(done) {

        service.removeResetPassToken(user._id)
            .then(result => {
                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    })

    afterEach('Clean functions', function() {
        userRepository = {}
        passwordService = {}
        user = {}
        service = {}
    })


})