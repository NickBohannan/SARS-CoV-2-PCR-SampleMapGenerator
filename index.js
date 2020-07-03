// dotenv is a utility that adds environment variables to the machine the program runs on. the file it will pull from is .env in the root directory. check the currently running program for the .env file. all environment variables will show up as process.env.X where X is the name of the variable.
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const routes = require('./routes/index')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/', routes)

// here you can change the port to anything you wish. notice that if there is a PORT environment variable in the .env file it will use that over the raw number.
const port = process.env.PORT || 8090

app.set('port', port)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})

module.exports = { app, path }