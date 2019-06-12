module.exports = class User {
    constructor(id, mail, name, password) {
        this.id = id
        this.mail = mail
        this.name = name
        this.password = password
    }

    static revive(json) {
        if (json === null) {
            return json;
        }
        return Object.assign(new User(), json);
    }
}