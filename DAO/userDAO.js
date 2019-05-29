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
    getByLogin(mail, done) {
        let user = null
        this.db.each("SELECT * FROM user WHERE mail = ?", [mail],
            (err, row) => { if (err == null) user = new User(row.mail, row.name ,row.passwordhash) },
            () => { done(user) }
        )
    }
    insert(user, done) {
        const stmt = this.db.prepare("INSERT INTO user(mail,name,passwordhash) VALUES (?, ?, ?)")
        stmt.run([user.mail, user.name, this.hashPassword(user.password)], done)
        stmt.finalize()
    }

    update(id, user, done) {
        const stmt = this.db.prepare("UPDATE user SET mail=?,name=?,passwordhash=? WHERE id=?")
        stmt.run(user.mail, user.name, this.hashPassword(user.password), id, done)
        stmt.finalize()
    }

    delete(id, done) {
        const stmt = this.db.prepare("DELETE FROM user WHERE id=?")
        stmt.run(id, done)
        stmt.finalize()
    }

    getAll(done) {
        const users = []
        this.db.each("SELECT id,mail,name,passwordhash FROM user ORDER BY name",
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
