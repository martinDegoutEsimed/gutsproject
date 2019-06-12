module.exports = (app, dao, auth) => {

    app.get("/challenge", (req, res) => {
        dao.getAll((challenges) => {
            return res.json(challenges)
        })
    })

    app.get("/challengeLikes", (req, res) => {
        dao.getAllByLikes((challenges)=> {
            return res.json(challenges)
        })
    })

    app.get("/challengeNoDone", (req, res) =>{
        dao.noDoneByDate((challenges)=>{
            return res.json(challenges)
        })
    })

    app.get("/challengeLikesNoDone", (req, res) =>{
        dao.noDoneByLikes((challenges)=>{
            return res.json(challenges)
        })
    })

    app.get("/challenge/:mail", (req, res) => {
        dao.getAllByUser(req.params.mail, (challenges)=> {
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

    app.put("challenge/hide/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getById(req.params.id, (challenge)=>{
            if(challenge.hidden === 0){
                console.log("hide")
                challenge.hidden = 1;
                dao.update(req.params.id, challenge, function(err) {
                    if(err == null) {
                        return res.status(200).type('text/plain').end()
                    }
                    else return res.status(500).jsonp(err).end()
                })
            }
            else {
                console.log("show")
                challenge.hidden = 0;
                dao.update(req.params.id, challenge, function(err) {
                    if(err == null) {
                        return res.status(200).type('text/plain').end()
                    }
                    else return res.status(500).jsonp(err).end()
                })

            }
        })
    })

    app.put("/challenge/like/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getByIdAndCurrentLike(req.user.id, req.params.id, (challenge) => {
            if(challenge.id_user === null){
                challenge.likes = 1+parseInt(challenge.likes)
                dao.insertLike(req.user.id, req.params.id,
                    function(err){
                    if(err == null){
                        dao.update(req.params.id, challenge,
                            function(err) {
                            if(err == null){
                                console.log("Like")
                                return res.status(200).type('text/plain').end()
                            }
                            else return res.status(500).jsonp(err).end()
                        })
                    }
                    else return res.status(500).jsonp(err).end()
                })
                //return
            }
            else {
                challenge.likes = -1+parseInt(challenge.likes)
                dao.deleteLike(req.user.id, req.params.id, function(err) {
                    if(err == null){
                        dao.update(req.params.id, challenge, function(err) {
                            if(err == null){
                                console.log("unlike")
                                return res.status(200).type('text/plain').end()
                            }
                            else return res.status(500).jsonp(err).end()
                        })
                    }
                    else return res.status(500).jsonp(err).end()
                })
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
