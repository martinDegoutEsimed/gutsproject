const bcrypt = require('bcrypt')
const User = require('../model/user')
const BaseDAO = require('./BaseDAO')

module.exports = class UserDAO extends BaseDAO{

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
    getByLogin(login, done) {
        let user = null
        this.db.each("SELECT * FROM user WHERE login = ?", [login],
            (err, row) => { if (err == null) user = new User(row.login, row.passwordhash) },
            () => { done(user) }
        )
    }
    insert(user, done) {
        const stmt = this.db.prepare("INSERT INTO user(login,passwordhash) VALUES (?, ?)")
        stmt.run([user.login, this.hashPassword(user.password)], done)
        stmt.finalize()
    }

    update(id, user, done) {
        const stmt = this.db.prepare("UPDATE user SET login=?,passwordhash=? WHERE id=?")
        stmt.run(user.login, this.hashPassword(user.password), id, done)
        stmt.finalize()
    }

    delete(id, done) {
        const stmt = this.db.prepare("DELETE FROM user WHERE id=?")
        stmt.run(id, done)
        stmt.finalize()
    }

    getAll(done) {
        const users = []
        this.db.each("SELECT id,login,passwordhash FROM user ORDER BY login",
            (err, row) => {
                if (err == null) {
                    let u = User.revive(row)
                    u.id = row.id
                    users.push(u)
                }
            },
            (err) => {
                if (err == null && done) {
                    done(users)
                }
            })
    }

}
