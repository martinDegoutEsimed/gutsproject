const sqlite = require('sqlite3')
const fileExists = require('file-exists')
const favicon = require('serve-favicon')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const db = new sqlite.Database("./mabase.db")
const UserDAO = require('./DAO/userDAO')
const ChallengeDAO = require ('./DAO/challengeDAO')
const CommentDAO = require('./DAO/commentDAO')
userDAO = new UserDAO(db)
challengeDAO = new ChallengeDAO(db)
commentDAO = new CommentDAO(db)
const passport = require('passport')
const morgan = require('morgan')
const app = express()
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({keys: ['exemplecourssecretkey']}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const router = express.Router();

const Seeder = require('./model/seeder')
const seeder = new Seeder(userDAO,challengeDAO,commentDAO)

app.use(passport.initialize())
app.use(passport.session())

const auth = require('./model/passport.js')(passport, userDAO)

require('./api/user')(app, userDAO, auth)
require('./api/challenge')(app, challengeDAO, auth)
require('./api/comment')(app, commentDAO, auth)

app.use('/', router);

app.use(morgan('dev'));

seeder.init();

require('./routes')(app, passport, auth)


app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.listen(3333)