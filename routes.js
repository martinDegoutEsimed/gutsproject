module.exports = (app, passport, auth) => {

    const web = __dirname + '/web/'
    const css = web + '/css/'
    const js = web + '/js/'

    app.get(['/login'], (req, res) => {
        if (req.originalUrl === '/') {
            res.sendFile(web + 'index.html')
            return
        }
        res.sendFile(web + req.path  + '.html')
    })

    app.get(['*.html'], (req, res) => {
        res.sendFile(web + req.path)
    })

    app.get(['/welcome', '/createAccount'], (req, res) => {
        res.sendFile(web + req.path + '.html')
    })

    app.get(['/', '/index', '/users/*', '/challenges/*', '/comments/*'], auth.isLoggedInWeb, (req, res) => {
        console.log(req.user);
        res.sendFile(web + req.path + '.html')
    })

    app.post('/authenticate',
        passport.authenticate('local-login', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/index');
        });


    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/welcome')
    })


    app.get('*.css', (req, res) => {
        res.sendFile(css + req.path)
    })

    app.get('*.js', (req, res) => {
        res.sendFile(js + req.path)
    })

}