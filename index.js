const path = require('path')
require('dotenv').config({
    path: path.join(__dirname, '.env')
})

const { db, string, options } = require('./app/framework/database/db.connect')
const { app } = require("./app/framework/startup/app.js")

db.connect(string, options)
    .then(() => {
        console.log("Database: mongodb connection successful")
        app.listen(app.get('port'), app.get('ip'), function() {
            console.log('Server: running at http://', app.get('ip'), ':', app.get('port'))
            console.log('Environmnet:', app.get('env'))
        })
    })
    .catch(e => console.log('Database error: ', e))