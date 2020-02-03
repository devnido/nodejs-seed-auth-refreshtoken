const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const driver = process.env.DB_AUTH_DRIVER;
const host = process.env.DB_AUTH_HOST;
const port = process.env.DB_AUTH_PORT;
const user = process.env.DB_AUTH_USERNAME;
const pass = process.env.DB_AUTH_PASSWORD;
const database = process.env.DB_AUTH_DATABASE;

const connectionString = `${driver}://${host}:${port}/${database}`;

mongoose.connection.on('error', err => {
    console.log("el error de la coneccion mongodb");
    console.log(err);
});

const mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

if (user && pass) {
    mongoOptions.auth = {
        user: user,
        password: pass
    }
}


module.exports = mongoose.createConnection(connectionString, mongoOptions)