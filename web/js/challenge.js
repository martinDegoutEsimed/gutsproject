console.log('Challenges');
const serviceUrl = "http://localhost:3333/challenge";

class Challenge {
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
};

class ChallengeService {
    delete(id, done) {
        ajax("DELETE", serviceUrl + "/" + id, done)
    }
    insert(challenge, done) {
        ajax("POST", serviceUrl, done, challenge)
    }
    get(id, done) {
        ajax("GET", serviceUrl + "/" + id, done)
    }
    getAllFromUser(mail, done){
        ajax("GET", serviceUrl + "/" + mail, done)
    }
    getAll(done) {
        ajax("GET", serviceUrl, done)
    }
    getAllByLikes(done){
        ajax("GET", serviceUrl + "Likes", done)
    }
    like(id, challenge, done){
        ajax("PUT", serviceUrl + "/like/" + id, done, challenge)
    }
    hide(id, challenge, done){
        ajax("PUT", serviceUrl + "/hide/" + id, done, challenge)
    }
}

class ChallengeController {
    constructor() {
        this.api = new ChallengeService()
        this.tableChallenges = $('#table-challenges')
        this.tableChallenges4User = $('#table-challenges-user')
        this.dialogAddChallenge = jQuery('#dialog-add-challenge')
        this.curentUserName = "";
        this.displayAll()
        this.currentFilter = "date";
    }
    addChallenge() {
        ctrlUser.getCurrentUser((user)=> {
            ctrlUser.getByMail(user.mail, (userFinal) => {
                this.curentUserName = userFinal.name;
                let today = new Date();
                let desc = $('#add-challenge-description').value;
                if(desc.length > 140){
                    alert("Votre message est trop long ! > 140 charactères");
                    return
                }
                this.api.insert(
                    new Challenge(
                        $('#add-challenge-title').value,
                        desc,
                        0, today, this.curentUserName, 0, 0,
                        ),(status) => {
                        this.displayAll();
                        this.dialogAddChallenge.modal('hide')
                        $('#add-challenge-title').value = ""
                        $('#add-challenge-description').value = ""
                    });
                return false
            })
        })

    }

    like(id){
        this.api.get(id, (status, challenge) => {
            console.log(challenge)
            if (status === 200) {
                this.api.like(id, challenge, (status) => {
                    if(this.currentFilter === "like") {
                        this.displayAllByLikes()
                    }
                    else if (this.currentFilter === "date") {
                        this.displayAll()
                    }

                })
                return false
            } else if (status === 404) {
                alert("challenge inconnu")
            }
        })
    }

    hideFromUser(id){
        this.api.get(id, (status, challenge) => {
            console.log(challenge)
            if (status === 200) {
                this.api.hide(id, challenge, (status) => {
                    ctrlUser.displayPostedChallenges()
                })
                return false
            } else if (status === 404) {
                alert("challenge inconnu")
            }
        })
    }

    likeFromUser(id){
        this.api.get(id, (status, challenge) => {
            console.log(challenge)
            if (status === 200) {
                this.api.like(id, challenge, (status) => {
                    ctrlUser.displayPostedChallenges()
                })
                return false
            } else if (status === 404) {
                alert("challenge inconnu")
            }
        })
    }

    deleteChallenge(id){
        this.api.delete(id, (status)=> {
            if(status === 200){
                console.log("deleted")
            }
            else{
                console.log("not deleted")
            }
        })
    }

    getAllFromUser(mail){
        this.api.getAllFromUser(mail, (status, challenges)=> {
            let table = ""
            for (let challenge of challenges) {
                challenge = Object.assign(new Challenge(), challenge)

                let deleteText = ""
                if(challenge.likes > 0){
                    deleteText = "Ne peut pas être supprimé"
                }
                else if(challenge.likes <= 0){
                    deleteText = "Peut être supprimé"
                }

                let hiddenText = ""
                if(challenge.hidden === 0){
                    hiddenText = ""
                }
                else if(challenge.hidden === 1){
                    hiddenText = "Défi Caché ! 👁🛑"
                }
                let textDone = ""
                if (challenge.done === 0) {
                    textDone = "❌ Pas encore réalisé ! ❌"
                }
                else if (challenge.done === 1){
                    textDone = "🏆 Défi réalisé ! 🏆"
                }
                table +=
                    `<br>
            <div class="card text-center">
              <div class="card-header">
                ${challenge.title}
              </div>
              <div class="card-body">
                Posté par : ${challenge.author} <br>
                ${challenge.description} <br>
                ${challenge.likes} likes <br>
                ${textDone} <br>
                ${hiddenText} <br>
                ${deleteText} <br>
              </div>
              <div class="card-footer text-muted">
                <a id="buttonHide" onclick="ctrlChallenge.hideFromUser(${challenge.id})" class="btn btn-secondary">👁</a>
                <a id="buttonLike" onclick="ctrlChallenge.likeFromUser(${challenge.id})" class="btn btn-success float-left">❤</a>
                <a id="buttonComment" onclick="ctrlComment.getAllFromChallenge(${challenge.id})" class="btn btn-primary float-left">💬</a>
                <p class="float-right">Posté le ${challenge.dateCreation.toLocaleString()}</p>
              </div>
              
            </div>
            <br>`


            }
            this.tableChallenges4User.innerHTML = table;
        })
    }

    displayAllByLikes() {
        this.currentFilter = "like"
        this.api.getAllByLikes((status, challenges) => {
            if (status !== 200) {
                return
            }
            let table = "";
            for (let challenge of challenges) {
                challenge = Object.assign(new Challenge(), challenge)
                let textDone = ""
                if (challenge.done === 0) {
                    textDone = "❌ Pas encore réalisé ! ❌"
                }
                else if (challenge.done === 1){
                    textDone = "🏆 Défi réalisé ! 🏆"
                }
                table +=
                    `<br>
                <div class="card text-center">
                  <div class="card-header">
                    ${challenge.title}
                  </div>
                  <div class="card-body">
                    Posté par : <a href="users/user.html?username=${challenge.author}" >${challenge.author}</a>  <br>
                    ${challenge.description} <br>
                    ${challenge.likes} likes <br>
                    ${textDone} <br>
                  </div>
                  <div class="card-footer text-muted">
                    <a id="buttonLike" onclick="ctrlChallenge.like(${challenge.id})" class="btn btn-success float-left">❤</a>
                    <a id="buttonComment" onclick="ctrlComment.getAllFromChallenge(${challenge.id})" class="btn btn-primary float-left">💬</a>
                    <p class="float-right">Posté le ${challenge.dateCreation.toLocaleString()}</p>
                  </div>
                  
                </div>
                <br>`
            }
            this.tableChallenges.innerHTML = table
        })
    }

    displayAll() {
        this.currentFilter = "date"
        this.api.getAll((status, challenges) => {
            if (status !== 200) {
                return
            }
            let table = "";
            for (let challenge of challenges) {
                challenge = Object.assign(new Challenge(), challenge)
                let textDone = ""
                if (challenge.done === 0) {
                    textDone = "❌ Pas encore réalisé ! ❌"
                }
                else if (challenge.done === 1){
                    textDone = "🏆 Défi réalisé ! 🏆"
                }
                table +=
                `<br>
                <div class="card text-center">
                  <div class="card-header">
                    ${challenge.title}
                  </div>
                  <div class="card-body">
                    Posté par : <a href="users/user.html?username=${challenge.author}" >${challenge.author}</a> <br>
                    ${challenge.description} <br>
                    ${challenge.likes} likes <br>
                    ${textDone} <br>
                  </div>
                  <div class="card-footer text-muted">
                    <a id="buttonLike" onclick="ctrlChallenge.like(${challenge.id})" class="btn btn-success float-left">❤</a>
                    <a id="buttonComment" onclick="ctrlComment.getAllFromChallenge(${challenge.id})" class="btn btn-primary float-left">💬</a>
                    <p class="float-right">Posté le ${challenge.dateCreation.toLocaleString()}</p>
                  </div>
                  
                </div>
                <br>`
            }
            this.tableChallenges.innerHTML = table
        })
    }
}

const ctrlChallenge = new ChallengeController();