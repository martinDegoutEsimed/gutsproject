console.log('Challenges');
const serviceUrl = "http://localhost:3333/challenge";

class Challenge {
    constructor(title, description, likes, dateCreation, author) {
        this.title = title
        this.description = description
        this.likes = likes
        this.dateCreation = dateCreation
        this.author = author
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
    getAll(done) {
        ajax("GET", serviceUrl, done)
    }
    like(id, challenge, done){
        ajax("PUT", serviceUrl + "/" + id, done, challenge)
    }
}

class ChallengeController {
    constructor() {
        this.api = new ChallengeService()
        this.tableChallenges = $('#table-challenges')
        this.dialogAddChallenge = jQuery('#dialog-add-challenge')
        this.curentUserName = "";
        this.displayAll()
        document.querySelector("#form-add-challenge").addEventListener("submit", (event) => {
            event.preventDefault();
            this.addChallenge();
        })
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
                        0, today, this.curentUserName,
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
            console.log("id challenge : " + id)
            if (status === 200) {
                this.api.like(id, challenge, (status) => {
                    this.displayAll()
                })
                return false
            } else if (status === 404) {
                alert("challenge inconnu")
            }
        })
    }

    displayAll() {
        this.api.getAll((status, challenges) => {
            if (status !== 200) {
                console.log(status)
                return
            }
            let table = "";
            for (let challenge of challenges) {
                challenge = Object.assign(new Challenge(), challenge)
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
                    <a href="#" class="btn btn-success">C'est parti !</a>
                  </div>
                  <div class="card-footer text-muted">
                    <a id="buttonLike" onclick="ctrlChallenge.like(${challenge.id})" class="btn btn-success float-left">❤</a>
                    <a id="buttonComment" href="#" class="btn btn-primary float-left">💬</a>
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