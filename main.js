const sqlite = require('sqlite3')
const fileExists = require('file-exists')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const db = new sqlite.Database("./mabase.db")
const UserDAO = require('./DAO/userDAO')
const morgan = require('morgan')
const app = express()
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({keys: ['exemplecourssecretkey']}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const router = express.Router();

userDAO = new UserDAO(db)

const Seeder = require('./model/seeder')
const seeder = new Seeder(userDAO)

app.use(passport.initialize())
app.use(passport.session())

const auth = require('./model/passport.js')(passport, userDAO)

require('./api/user')(app, userDAO, auth)


app.use('/', router);

app.use(morgan('dev'));

seeder.init();

require('./routes')(app, passport, auth)
app.listen(3333)