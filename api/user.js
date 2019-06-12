module.exports = (app, userDao, auth) => {

    app.get("/user/current", auth.isLoggedInAPI, (req, res) => {
        res.status(200).jsonp(req.user).end();
    });

    app.get("/userAll", (req, res) => {
        userDao.getAll((users) => {
            return res.json(users)
        })
    })

    app.post("/user", (req, res) => {
        const user = req.body
        console.log(req.body)
        if (user.mail === undefined
            || user.name === undefined
            || user.password === undefined) {
            res.status(400).end()
            return
        }
        userDao.insert(user, (fdg, err) => {
            if (err == null) {
                return res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    });

    app.get("/user/mail/:mail", auth.isLoggedInAPI, (req, res) => {
        userDao.getByLogin(req.params.mail, (user) => {
            return res.json(user)
        })
    });

    app.get("/user/username/:name", auth.isLoggedInAPI, (req, res) => {
        userDao.getByUserName(req.params.name, (user) => {
            return res.json(user)
        })
    });

    app.delete("/user/:id", auth.isLoggedInAPI, (req, res) => {
        userDao.delete(req.params.id, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

    app.put("/user/:mail", auth.isLoggedInAPI, (req, res) => {
        const user = req.body;
        if (user.mail === undefined
            || user.name === undefined
            || user.password === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        userDao.update(req.params.mail, user, (err) => {
            if (err == null) {
                req.login(user, (err)=> {
                    if(err){
                        res.status(500).type('text/plain').end()
                        return
                    }
                    res.status(200).type('text/plain').end()
                    return
                })

            } else {
                res.status(500).end()
            }
        })
    })

}