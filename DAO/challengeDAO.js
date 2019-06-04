const Challenge = require('../model/challenge')
const BaseDAO = require('./BaseDAO')

module.exports = class ChallengeDAO extends BaseDAO{

    delete(id, done) {
        const stmt = this.db.prepare("DELETE FROM challenge WHERE id=?")
        stmt.run(id, done)
        stmt.finalize()
    }
    like(id, challenge, done){
        let likes = challenge.likes;
        likes = likes+1;
        const stmt = this.db.prepare("UPDATE challenge SET likes=? WHERE id=?")
        stmt.run(likes, id, done)
        stmt.finalize()
    }
    getById(id, done) {
        let challenge = null
        this.db.each("SELECT * FROM challenge WHERE id = ?", [id],
            (err, row) => { if (err == null) challenge = Object.assign(new Challenge(), row) },
            () => { done(challenge) }
        )
    }
    insert(challenge, done) {
        this.run("INSERT INTO challenge(title,description,likes,dateCreation,author) VALUES (?, ?, ?, ?, ?)",[challenge.title, challenge.description, challenge.likes, challenge.dateCreation, challenge.author], done)
    }

    getAll(done) {
        const challenges = []
        this.db.each("SELECT id,title,description,likes,dateCreation,author FROM challenge ORDER BY dateCreation",
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