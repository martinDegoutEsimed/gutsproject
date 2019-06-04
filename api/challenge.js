module.exports = (app, dao, auth) => {

    app.get("/challenge", (req, res) => {
        dao.getAll((challenges) => {
            return res.json(challenges)
        })
    })

    app.get("/challenge/:id", (req, res) => {
        dao.getById(req.params.id, (challenge) => {
            if (challenge == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(challenge)
            }
        })
    })

    app.put("/challenge/:id", auth.isLoggedInAPI, (req, res) => {
        const challenge = req.body;
        console.log(challenge)
        dao.like(req.params.id, challenge, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

    app.post("/challenge", auth.isLoggedInAPI, (req, res) => {
        const challenge = req.body
        if (challenge.title === undefined
            || challenge.description === undefined) {
            res.status(400).end()
            return
        }
        dao.insert(challenge, (fdg, err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

    app.delete("/challenge/:id", auth.isLoggedInAPI, (req, res) => {
        dao.delete(req.params.id, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

}
