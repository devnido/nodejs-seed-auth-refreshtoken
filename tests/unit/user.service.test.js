const expect = require('chai').expect
const sinon = require('sinon')

const userMock = require('../mocks/user.mock')
const userDbMock = require('../mocks/userdb.mock')

let userService = require('../../app/components/users/user.service')
let userRepositoryMock = {}
let passwordServiceMock = {}
let user = {}
let service = {}

describe('Testing user service', () => {


    beforeEach('Prepare functions', function() {

        user = {...userDbMock }

        userRepository = {
            existsByEmail: sinon.stub().resolves(true),
            existsById: sinon.stub().resolves(true),
            existsByValidResetPassToken: sinon.stub().resolves(true),
            getById: sinon.stub().withArgs("5e376c66ce68605aa0ed1149").resolves(user),
            getByEmail: sinon.stub().withArgs("user@email.com").resolves(user),
            insert: sinon.stub().returns(user)
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


    afterEach('Clean functions', function() {
        userRepositoryMock = {}
        passwordServiceMock = {}
        user = {}
        service = {}
    })


})