const Comment = require('../model/comment')
const BaseDAO = require('./BaseDAO')

module.exports = class CommentDAO extends BaseDAO{

    getById(id, done) {
        let comment = null
        this.db.each("SELECT * FROM comment WHERE id = ?", [id],
            (err, row) => { if (err == null) comment = Object.assign(new Comment(), row) },
            () => { done(comment) }
        )
    }

    update(id, comment, done){
        const stmt = this.db.prepare("UPDATE comment SET " +
            "author=?," +
            "comment=?," +
            "challenge=?," +
            "proof=?," +
            "dateCreation=?" +
            " WHERE id=?")
        stmt.run(comment.author,
            comment.comment,
            comment.challenge,
            comment.proof,
            comment.dateCreation, id, done)
        stmt.finalize()
    }

    getAllByChallenge(challenge, done) {
        const comments = [];
        this.db.each("SELECT " +
            "id," +
            "author," +
            "comment," +
            "challenge," +
            "proof," +
            "dateCreation " +
            "FROM comment " +
            "WHERE challenge=? " +
            "ORDER BY dateCreation",[challenge],
            (err, row) => {
                if (err == null) {
                    let c = Comment.revive(row)
                    c.id = row.id
                    comments.push(c)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(comments)
                }
            })
    }

    insert(comment, done) {
        this.run("INSERT INTO comment(author," +
            "comment," +
            "challenge," +
            "proof," +
            "dateCreation) " +
            "VALUES (?, ?, ?, ?, ?)",
            [comment.author,
                comment.comment,
                comment.challenge,
                comment.proof,
                comment.dateCreation], done)
    }

    getAll(done) {
        const comments = []
        this.db.each("SELECT id,author,comment,challenge,proof,dateCreation FROM comment ORDER BY dateCreation",
            (err, row) => {
                if (err == null) {
                    let c = Comment.revive(row)
                    c.id = row.id
                    comments.push(c)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(comments)
                }
            })
    }
}