//import modules
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});
const express = require('express')
const cors = require('cors')
const app = express()

//database connect
require('./app/framework/database/db.connect');

//setting
const config = require('./app/framework/config/env')
app.set('ip', config.app.ip)
app.set('port', config.app.port)
app.set('trust proxy', true) // añadir configuracion al nginx
app.disable('x-powered-by')

//middlewares
app.get('env') === 'development' ? app.use(cors({
    exposedHeaders: ['Authorization', 'Refresh']
})) : app.use(cors());

const error = require('./app/framework/middlewares/error-handler.middleware')

app.use(express.json())
app.use(error.bodyParser)
app.use(express.urlencoded({
    extended: false
}));

//morgan development
let morgan = '';
app.get('env') === 'development' ? morgan = require('morgan') : '';
app.get('env') === 'development' ? app.use(morgan('dev')) : '';

//routes
const routes = require('./app/framework/routes/main.route');
routes.init(express, app);

//test route
// app.get('/', function(req, res) {
//     res.send('Auth Test Route /')
// });

// app.get('/test', function(req, res) {
//     res.send('Auth Test Route /test')
// })


//seed
require('./seeds/index').exec();

app.use(error.log)
app.use(error.handler)
app.use(error.notFound);
//start server
const server = app.listen(app.get('port'), app.get('ip'), function() {
    console.log('Server running in http://%s:%s', app.get('ip'), app.get('port'))
    console.log(app.get('env'));
})

module.exports = server