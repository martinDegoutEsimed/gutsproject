const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const morgan = require('morgan')
const app = express()
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({keys: ['exemplecourssecretkey']}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
const router = express.Router();
app.use('/', router);
app.use(morgan('dev'));
require('./routes')(app);
app.listen(3333);