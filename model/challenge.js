module.exports = class Challenge {
    constructor(title, description, likes, dateCreation, author, done, hidden) {
        this.title = title
        this.description = description
        this.likes = likes
        this.dateCreation = dateCreation
        this.author = author
        this.done = done
        this.hidden = hidden
    }

    static revive(json) {
        if (json === null) {
            return json;
        }
        let challenge = Object.assign(new Challenge(), json);
        if (typeof challenge.dateCreation === 'number') {
            challenge.dateCreation = tools.intToDate(json.dateCreation);
        } else if (typeof challenge.dateCreation === 'string') {
            challenge.dateCreation = new Date(json.dateCreation);
        }
        return challenge;
    }
}