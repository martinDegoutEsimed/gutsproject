module.exports = (app, dao, auth) => {

    app.get("/comment", (req, res) => {
        dao.getAll((comments) => {
            return res.json(comments)
        })
    })


    app.get("/comment/challenge/:challenge", (req, res) => {
        dao.getAllByChallenge(req.params.challenge, (comments)=>{
            return res.json(comments)
        })
    })

    app.get("/comment/:id", (req, res) => {
        dao.getById(req.params.id, (comment) => {
            if (comment == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(comment)
            }
        })
    })

    app.post("/comment", auth.isLoggedInAPI, (req, res) => {
        const comment = req.body
        if (comment.author === undefined
            || comment.comment === undefined
            || comment.challenge === undefined) {
            res.status(400).end()
            return
        }
        dao.insert(comment, (fdg, err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    })

}
