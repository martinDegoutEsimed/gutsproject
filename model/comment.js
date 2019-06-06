module.exports = class Comment {
    constructor(author, comment, challenge, proof, dateCreation) {
        this.author = author
        this.comment = comment
        this.challenge = challenge
        this.proof = proof
        this.dateCreation = dateCreation
    }

    static revive(json) {
        if (json === null) {
            return json;
        }
        let comment = Object.assign(new Comment(), json);
        if (typeof comment.dateCreation === 'number') {
            comment.dateCreation = tools.intToDate(json.dateCreation);
        } else if (typeof comment.dateCreation === 'string') {
            comment.dateCreation = new Date(json.dateCreation);
        }
        return comment;
    }
}