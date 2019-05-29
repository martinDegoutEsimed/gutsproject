module.exports = (app, userDao, auth) => {

    app.get("/user", auth.isLoggedInAPI, (req, res) => {
        res.json(req.user)
    })

    app.get("/userAll", auth.isLoggedInAPI, (req, res) => {
        userDao.getAll((users) => {
            console.log(users)
            return res.json(users)
        })
    })

    app.post("/user", auth.isLoggedInAPI, (req, res) => {
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
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

    app.delete("/user/:id", auth.isLoggedInAPI, (req, res) => {
        userDao.delete(req.params.id, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

    app.put("/user/:id", auth.isLoggedInAPI, (req, res) => {
        const user = req.body;
        if (user.mail === undefined
            || user.name === undefined
            || user.password === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        userDao.update(req.params.id, user, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

}