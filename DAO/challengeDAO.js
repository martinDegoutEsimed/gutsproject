const Challenge = require('../model/challenge')
const BaseDAO = require('./BaseDAO')

module.exports = class ChallengeDAO extends BaseDAO{


    like(id, challenge, done){
        let likes = challenge.likes;
        likes = likes+1;
        const stmt = this.db.prepare("UPDATE challenge SET likes=? WHERE id=?")
        stmt.run(likes, id, done)
        stmt.finalize()
    }

    insertLike(user_id, challenge_id, done){
        const stmt = this.db.prepare("INSERT INTO likes(id_user,id_challenge) VALUES (?, ?)")
        stmt.run(user_id, challenge_id, done)
        stmt.finalize()
    }

    deleteLike(user_id, challenge_id, done){
        const stmt = this.db.prepare("DELETE FROM likes WHERE id_user=? AND id_challenge=?")
        stmt.run(user_id, challenge_id, done)
        stmt.finalize()
    }

    update(id, challenge, done){
        const stmt = this.db.prepare("UPDATE challenge SET " +
            "title=?," +
            "description=?," +
            "likes=?," +
            "dateCreation=?," +
            "author=?," +
            "done=?," +
            "hidden=? WHERE id=?")
        stmt.run(challenge.title,
            challenge.description,
            challenge.likes,
            challenge.dateCreation,
            challenge.author,
            challenge.done,
            challenge.hidden, id, done)
        stmt.finalize()
    }

    delete(id, done) {
        const stmt = this.db.prepare("DELETE FROM chalenge WHERE id=?")
        stmt.run(id, done)
        stmt.finalize()
    }

    getById(id, done) {
        let challenge = null
        this.db.each("SELECT id,title,description,likes,dateCreation,author,done,hidden FROM challenge WHERE id = ?", [id],
            (err, row) => { if (err == null) challenge = Object.assign(new Challenge(), row) },
            () => { done(challenge) }
        )
    }
    getByIdAndCurrentLike(currentUserID, id, done) {
        let challenge = null
        this.db.each("SELECT * FROM challenge " +
            "LEFT JOIN likes ON id_challenge = challenge.id AND id_user = ? " +
            " WHERE id = ?", [currentUserID, id],
            (err, row) => { if (err == null) challenge = Object.assign(new Challenge(), row) },
            () => { done(challenge) }
        )
    }
    insert(challenge, done) {
        this.run("INSERT INTO challenge(title,description,likes,dateCreation,author,done,hidden) VALUES (?, ?, ?, ?, ?, ?, ?)",[challenge.title, challenge.description, challenge.likes, challenge.dateCreation, challenge.author, challenge.done, challenge.hidden], done)
    }

    getAllByUser(mail, done){
        const challenges = []
        this.db.each("SELECT id,title,description,likes,dateCreation,author,done,hidden FROM challenge WHERE author = ? ORDER BY likes DESC", [mail],
            (err, row) => {
                if (err == null) {
                    let c = Challenge.revive(row)
                    c.id = row.id
                    challenges.push(c)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(challenges)
                }
            })
    }

    getAllByLikes(done){
        const challenges = []
        this.db.each("SELECT id,title,description,likes,dateCreation,author,done,hidden FROM challenge WHERE hidden=? ORDER BY likes DESC",[0],
            (err, row) => {
                if (err == null) {
                    let c = Challenge.revive(row)
                    c.id = row.id
                    challenges.push(c)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(challenges)
                }
            })
    }

    getAll(done) {
        const challenges = []
        this.db.each("SELECT id,title,description,likes,dateCreation,author,done,hidden FROM challenge WHERE hidden=? ORDER BY dateCreation DESC",[0],
            (err, row) => {
                if (err == null) {
                    let c = Challenge.revive(row)
                    c.id = row.id
                    challenges.push(c)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(challenges)
                }
            })
    }
}