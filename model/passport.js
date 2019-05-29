const LocalStrategy = require('passport-local').Strategy
const User = require('../model/user')

module.exports =  (passport, userDAO) => {

    // objet utilisateur -> identifiant de session
    passport.serializeUser((user, done) => {
        done(null, user.mail)
    })

    // identifiant de session -> objet utilisateur
    passport.deserializeUser((mail, done) => {
        done(null, new User(mail))
    })

    passport.use('local-login', new LocalStrategy({
            // champs du formulaire login
            usernameField: 'mail',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, mail, password, done) => {
            /*if (login[0] === 'z') {
                return done(null, new User(login))
            }
            return done(null, false)
            */
            userDAO.getByLogin(mail, (user) => {
                if (user != null && userDAO.comparePassword(password, user.password)) {
                    return done(null, new User(mail))
                } else {
                    return done(null, false)
                }
            })
        })
    )

    // autologin
    var defaultUser = null
    /*userDAO.getByLogin("user1", (user) => {
        defaultUser = user
    })*/

    return {
        isLoggedInAPI(req, res, next) {
            // autologin
            if (defaultUser != null) {
                req.user = defaultUser
                return next()
            }
            // si utilisateur authentifiĂ©, continuer
            if (req.isAuthenticated()) {
                return next()
            }
            // sinon erreur 'Unauthorized'
            res.status(401).type("text/plain").end()
        },
        isLoggedInWeb(req, res, next) {
            // autologin
            if (defaultUser != null) {
                req.user = defaultUser
                return next()
            }
            // si utilisateur authentifiĂ©, continuer
            if (req.isAuthenticated()) {
                return next()
            }
            // sinon afficher formulaire de login
            res.redirect('/login')
        }
    }
}