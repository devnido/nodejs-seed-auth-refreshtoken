const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const driver = process.env.DB_AUTH_DRIVER
const host = process.env.DB_AUTH_HOST
const port = process.env.DB_AUTH_PORT
const user = process.env.DB_AUTH_USERNAME
const password = process.env.DB_AUTH_PASSWORD
const database = process.env.DB_AUTH_DATABASE

const string = `${driver}://${host}:${port}/${database}`

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    ...(user && password ? { auth: { user, password } } : {})
}

const db = mongoose

module.exports = { db, options, string }