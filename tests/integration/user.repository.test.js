const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const expect = require('chai').expect

const userMock = require('../mocks/user.mock')
const User = require('../../app/components/users/user.model')
const userRepository = require('../../app/components/users/user.repository')

const repository = userRepository({ User })

describe('Testing user repository', function() {

    before('database connect', function(done) {

        mongoose.connect('mongodb://0.0.0.0:27017/seedauthtestdb', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            })
            .then(() => {
                done()
            })
            .catch(e => {
                done(e)
            })

    });

    beforeEach('populate users collection', function(done) {

        userMock.password = bcrypt.hashSync("123456", 8)
        userMock.resetPassToken = "asjdjakshdakjsdhjkas"
        userMock.resetPassTokenExpDate = Date.now() + 1000 * 60 * 2 // 2 minutes in milliseconds
        userMock.refreshToken = "asjdhaskjdajkdhakj"
        userMock.refreshTokenExpDate = Date.now() + 1000 * 60 * 2
        User.create(userMock)
            .then(result => {
                done()
            })
            .catch(e => {
                console.log(e);
                done(e)
            })

    });

    it("Should return true if user exists by id", function(done) {

        repository.existsById(userMock._id)
            .then(result => {

                expect(result).equals(true)

                done()
            })
            .catch(e => {
                console.log(e)
                done(e)
            })
    });

    it("Should return false if user does not exists by id", function(done) {

        repository.existsById("5e376c66ce68605aa0ed1148")
            .then(result => {

                expect(result).equals(false)

                done()
            })
            .catch(e => {
                console.log(e)
                done(e)
            })
    });

    it("Should return true if user exists by email", function(done) {

        repository.existsByEmail(userMock.email)
            .then(result => {

                expect(result).equals(true)

                done()
            })
            .catch(e => {
                console.log(e)
                done(e)
            })
    });

    it("Should return false if user does not exists by email", function(done) {

        repository.existsByEmail("email@email.com")
            .then(result => {

                expect(result).equals(false)

                done()
            })
            .catch(e => {
                console.log(e)
                done(e)
            })
    });

    it("Should return an user by id", function(done) {

        repository.getById(userMock._id)
            .then(user => {

                expect(JSON.parse(JSON.stringify(user)))
                    .have.property('_id')
                    .to.be.equal(userMock._id)

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should return an user by valid reset pass token", function(done) {

        repository.existsByValidResetPassToken(userMock.resetPassToken, Date.now())
            .then(result => {

                expect(result).equals(true)

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should return false if find a user by expired reset pass token", function(done) {

        repository.existsByValidResetPassToken(userMock.resetPassToken, Date.now() + 1000 * 60 * 5)
            .then(result => {

                expect(result).equals(false)

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should return a user that contains refresh token", function(done) {

        repository.getByIdWithRefreshToken(userMock._id, Date.now())
            .then(user => {

                expect(user.refreshToken).equals("asjdhaskjdajkdhakj")

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should return a user if find by expired reset pass token", function(done) {

        repository.getByResetPassToken(userMock.resetPassToken, Date.now())
            .then(user => {

                expect(JSON.parse(JSON.stringify(user)))
                    .have.property('_id')
                    .to.be.equal(userMock._id)

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should return a user with password if find by email", function(done) {

        repository.getToAuthenticate(userMock.email)
            .then(user => {

                expect(bcrypt.compareSync('123456', user.password)).equals(true)

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should insert a user", function(done) {

        const newUser = { email: "hola@hola.com", password: "qwerty", name: "alan brito", status: "active" }

        repository.insert(newUser)
            .then(user => {

                expect(JSON.parse(JSON.stringify(user)))
                    .have.property('_id')

                expect(user.email).equals("hola@hola.com")

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user setting new refresh token", function(done) {

        repository.setRefreshToken('5e376c66ce68605aa0ed1149', 'thisisnewrefreshtoken', Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days in millisecods
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user setting new reset pass token", function(done) {

        repository.setResetPassToken('5e376c66ce68605aa0ed1149', 'thisisnewresettoken', Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days in millisecods
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user removing reset pass token", function(done) {

        repository.removeResetPassToken('5e376c66ce68605aa0ed1149')
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user removing reset pass token", function(done) {

        repository.removeResetPassToken('5e376c66ce68605aa0ed1149')
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user removing refresh token", function(done) {

        repository.removeRefreshToken('5e376c66ce68605aa0ed1149')
            .then(result => {

                expect(result).to.be.include({ n: 1, nModified: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    it("Should update a user removing refresh token", function(done) {

        repository.delete('5e376c66ce68605aa0ed1149')
            .then(result => {

                expect(result).to.be.include({ n: 1, deletedCount: 1, ok: 1 })

                done()
            })
            .catch(e => {
                done(e)
            })
    });

    afterEach('clean articles collection', function(done) {

        User.deleteMany({})
            .then(result => {
                done()
            })
            .catch(err => {
                done(err)
            });
    });

    after('database disconnect', function(done) {

        mongoose.disconnect()
            .then(() => {
                done()
            })
            .catch(err => {
                done(err)
            })
    });

});