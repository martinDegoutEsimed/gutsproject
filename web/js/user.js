console.log("Users");
const serviceUrlUser = "http://localhost:3333/user";

class User {
    constructor(id, mail, name, password) {
        this.id = id;
        this.mail = mail;
        this.name = name;
        this.password = password;
    }
}

class UserService {
    update(mail, user, done) {
        ajax("PUT", serviceUrlUser + "/" + mail, done, user)
    }
    delete(id, done) {
        ajax("DELETE", serviceUrlUser + "/" + id, done)
    }
    insert(user, done) {
        ajax("POST", serviceUrlUser, done, user)
    }
    get(mail, done) {
        ajax("GET", serviceUrlUser + "/mail/" + mail, done)
    }
    getByName(name, done) {
        ajax("GET", serviceUrlUser + "/username/" + name, done)
    }
    getAll(done) {
        ajax("GET", serviceUrlUser + "all", done)
    }
    getCurrent(done){
        ajax("GET", serviceUrlUser + "/current", done)
    }
}

class UserController {
    constructor() {
        this.api = new UserService()
        this.pageLocation = new URL(window.location.href);
        this.tableUsers = $('#table-users')
        this.tableChallenges4User = $('#table-challenges-user')
        this.dialogDeleteUser = jQuery('#dialog-delete-user')
        this.dialogEditUser = jQuery('#dialog-edit-user')
        this.displayUser()
    }

    findParameterInUrl(parameter) {
        if (typeof parameter === "undefined") {
            throw "parameter is required";
        }

        return this.pageLocation.searchParams.get(parameter);
    }

    getByMail(mail, callback){
        this.api.get(mail, (status, user) =>{
            if(status === 200){
                callback(user);
            }
            else {
                console.log(status)
            }
        })
    }

    getByName(name, callback){
        this.api.getByName(name, (status, user) =>{
            if(status === 200){
                callback(user);
            }
            else {
                console.log(status)
            }
        })
    }

    displayUser(){
        let userName = this.findParameterInUrl("username")
        if(ToolsFront.empty(userName)){
            this.getCurrentUser((usr) => {
                this.getByMail(usr.mail, (userFinal) => {
                    $('#userName').innerHTML = `${userFinal.name}`;
                    $('#userMail').innerHTML = `${userFinal.mail}`;
                })
            })
            return
        }
        this.getByName(userName, (userFinal) => {
            $('#buttonEditProfile').style.display = 'none';
            $('#userName').innerHTML = `${userFinal.name}`;
            $('#userMail').innerHTML = `${userFinal.mail}`;
        })
    }

    editUser() {
        this.getCurrentUser((user1) => {
            this.getByMail(user1.mail, (user2) => {
                $("#edit-user-mail").value = user2.mail
                $("#edit-user-name").value = user2.name
                this.dialogEditUser.modal('show')
            })
        })
    }

    getCurrentUser(callback){
        this.api.getCurrent((status, user) => {
            if(status === 200) {
                //localStorage.setItem("userMail", user.mail);
                callback(user);
            }
            else {
                console.log(status)
            }
        })
    }

    updateUser() {
        this.getCurrentUser((user1) => {
            this.getByMail(user1.mail, (user2) => {
                this.api.update(user1.mail,
                    new User(user2.id, $("#edit-user-mail").value, $("#edit-user-name").value, $("#edit-user-password").value),
                    (status) => {
                        this.displayUser()
                        $("#edit-user-password").value = ""
                        this.dialogEditUser.modal('hide')
                    })
                return false
            })
        })

    }
    deleteUser(id) {
        this.api.get(id, (status, user) => {
            if (status === 200) {
                $("#label-delete-user").innerText = `${user.login}`
                $("#btn-delete-user").onclick = () => {
                    this.api.delete(id, (status) => {
                        this.dialogDeleteUser.modal('hide')
                    })
                }
                this.dialogDeleteUser.modal('show')
            } else if (status === 404) {
                alert("User inconnu")
            }
        })
    }
    addUser() {
        this.api.insert(new User(null, $('#add-user-mail').value, $('#add-user-name').value, $('#add-user-password').value), (status) => {
            if (status === 200) {
                window.location.href = "/login";
                $('#add-user-mail').value = ""
                $('#add-user-name').value = ""
                $('#add-user-password').value = ""
            }
        })
        return false
    }

    displayPostedChallenges(){
        ctrlChallenge.getAllFromUser($('#userName').innerHTML)
    }

    displayFollowChallenges(){

    }

    displayDoneChallenges(){

    }

    displayAll() {
        this.api.getAll((status, users) => {
            if (status !== 200) {
                return
            }
            let table = ""
            for (let user of users) {
                user = Object.assign(new User(), user)
                table += `<tr>
                    <td>${user.mail}</td><td>${user.name}</td>
                    <td><button class="btn btn-danger btn-sm" 
                                onclick="ctrlUser.deleteUser(${user.id})">X</button>
                        <button class="btn btn-warning btn-sm" 
                                onclick="ctrlUser.editUser(${user.id})">E</button></td>
                    </tr>`
            }
            this.tableUsers.innerHTML = table
        })
    }

}

const ctrlUser = new UserController();