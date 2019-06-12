console.log('Comments');
const serviceUrlComment = "http://localhost:3333/comment";

class Comment {
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

class CommentService {
    update(id, comment, done) {
        ajax("PUT", serviceUrlComment + "/" + id, done, comment)
    }
    insert(comment, done) {
        ajax("POST", serviceUrlComment, done, comment)
    }
    get(id, done) {
        ajax("GET", serviceUrlComment + "/" + id, done)
    }
    getAllChallengeComments(challenge, done){
        ajax("GET", serviceUrlComment + "/challenge/" + challenge, done)
    }
    getAll(done) {
        ajax("GET", serviceUrlComment, done)
    }
}

class CommentController {
    constructor() {
        this.api = new CommentService()
        this.tableComments = $('#table-comments')
        this.dialogComments = jQuery('#dialog-comments')
        this.dialogAddComment = jQuery('#dialog-add-comment')
        this.curentUserName = "";
        this.currentChallenge = 0;
        //this.displayAll()
    }

    addComment() {
        ctrlUser.getCurrentUser((user)=> {
            ctrlUser.getByMail(user.mail, (userFinal) => {
                this.curentUserName = userFinal.name;
                let today = new Date();
                let comment = $('#add-comment-comment').value;
                if(comment.length > 140){
                    alert("Votre commentaire est trop long ! > 140 charactères");
                    return
                }
                this.api.insert(
                    new Comment(this.curentUserName, comment, this.currentChallenge, "", today),(status) => {
                        this.getAllFromChallenge(this.currentChallenge)
                        this.dialogAddComment.modal('hide')
                        $('#add-comment-comment').value = ""
                    });
                return false
            })
        })

    }

    getAllFromChallenge(challenge){
        this.api.getAllChallengeComments(challenge, (status, comments)=> {
            this.currentChallenge = challenge;
            let table = ""
            this.dialogComments.modal('show')
            for (let comment of comments) {
                comment = Object.assign(new Comment(), comment)
                table +=
                    `<br>
                        <div class="card text-center">
                              <div class="card-header">
                                Par : <a href="users/user.html?username=${comment.author}" >${comment.author}</a> 
                              </div>
                              <div class="card-body">
                                ${comment.comment} <br>
                              </div>
                              <div class="card-footer text-muted">
                                <p class="float-right">Posté le ${comment.dateCreation.toLocaleString()}</p>
                              </div>
                        </div>
                    <br>`
            }
            this.tableComments.innerHTML = table;
        })
    }
}

const ctrlComment = new CommentController();