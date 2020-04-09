const { expect } = require('chai')

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.testing') })

const bcrypt = require('bcryptjs')
const config = require('../../app/framework/config/env')

const passwordService = require('../../app/framework/services/password.service')

let service = passwordService({ bcrypt, config })

describe('Testing password service - Integration Testing', () => {

    it('Should return a random token length of 8', function() {

        const token = service.generateRandomPassword()

        expect(token).to.be.a('String')
        expect(token).to.have.lengthOf(8)


    })

    it('Should return a ', function() {

        const passwordDB = bcrypt.hashSync('123456')

        const isEqual = service.comparePassword('123456', passwordDB)

        expect(isEqual).to.be.a('Boolean')
        expect(isEqual).to.be.equal(true)

    })

    it('Should return true when password are equals ', function() {

        const passwordDB = bcrypt.hashSync('123456')

        const isEqual = service.comparePassword('123456', passwordDB)

        expect(isEqual).to.be.a('Boolean')
        expect(isEqual).to.be.equal(true)

    })

    it('Should return false when password are not equals ', function() {

        const passwordDB = bcrypt.hashSync('123456')

        const isEqual = service.comparePassword('12345', passwordDB)

        expect(isEqual).to.be.a('Boolean')
        expect(isEqual).to.be.equal(false)

    })

    it('Should return false when password are not equals ', function() {



        const passwordHashed = service.hashPassword('123456')

        expect(passwordHashed).to.be.a('String')

        expect(passwordHashed).to.be.contain('$2a')


        console.log(passwordHashed)

    })



})