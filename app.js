const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

if (process.env.NODE_ENV !== 'testing') {
    require('dotenv').config({
        path: path.join(__dirname, '.env')
    });
}




//database connect
require('./app/framework/database/db.connect')

// Dependency Injection Init
const container = require('./app/framework/DI/container')

//setting
const config = container.resolve('config')
app.set('ip', config.app.ip)
app.set('port', config.app.port)
app.set('trust proxy', true) // añadir configuracion al nginx
app.disable('x-powered-by')

//middlewares
app.get('env') === 'development' ? app.use(cors({ exposedHeaders: ['Authorization', 'Refresh'] })) : app.use(cors())

const error = container.resolve('errorHandler')

app.use(express.json())
app.use(error.bodyParser)
app.use(express.urlencoded({
    extended: false
}));

//morgan development
let morgan = ''
app.get('env') === 'development' ? morgan = require('morgan') : ''
app.get('env') === 'development' ? app.use(morgan('dev')) : ''

//routes
const routes = container.resolve('routes')
routes.init(express, app)


//seed
//require('./seeds/index').exec();

app.use(error.log)
app.use(error.handler)
app.use(error.notFound)
    //start server
const server = app.listen(app.get('port'), app.get('ip'), function() {
    console.log('Server running in http://%s:%s', app.get('ip'), app.get('port'))
    console.log(app.get('env'))
})

module.exports = server