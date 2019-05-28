module.exports = class User {
    constructor(login, password) {
        this.login = login
        this.password = password
    }

    static revive(json) {
        if (json === null) {
            return json;
        }
        return Object.assign(new User(), json);
    }
}