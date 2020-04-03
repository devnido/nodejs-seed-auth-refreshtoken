const express = require('express')
const cors = require('cors')
const app = express()

// Dependency Injection Init
const container = require('../DI/container')

//setting
const config = container.resolve('config')
app.set('env', config.app.env)
app.set('ip', config.app.ip)
app.set('port', config.app.port)
app.set('trust proxy', true) // añadir configuracion a nginx
app.disable('x-powered-by')

//middlewares
app.get('env') === 'development' ? app.use(cors({ exposedHeaders: ['Authorization', 'Refresh'] })) : app.use(cors())

const error = container.resolve('errorHandler')

app.use(express.json())
app.use(error.bodyParser)
app.use(express.urlencoded({ extended: true }))

//morgan development
let morgan = ''
app.get('env') === 'development' ? morgan = require('morgan') : ''
app.get('env') === 'development' ? app.use(morgan('dev')) : ''

//routes
const routes = container.resolve('routes')
routes.init(express, app)

app.use(error.log)
app.use(error.handler)
app.use(error.notFound)

//export server
module.exports = { app }