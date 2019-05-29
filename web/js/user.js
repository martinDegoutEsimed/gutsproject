console.log("Users");
const serviceUrl = "http://localhost:3333/user";

class User {
    constructor(mail, name, password) {
        this.mail = mail;
        this.name = name;
        this.password = password;
    }
}

class UserService {
    update(id, user, done) {
        ajax("PUT", serviceUrl + "/" + id, done, user)
    }
    delete(id, done) {
        ajax("DELETE", serviceUrl + "/" + id, done)
    }
    insert(user, done) {
        ajax("POST", serviceUrl, done, user)
    }
    get(id, done) {
        ajax("GET", serviceUrl + "/" + id, done)
    }
    getAll(done) {
        ajax("GET", serviceUrl + "all", done)
    }
}

class UserController {
    constructor() {
        this.api = new UserService()
        this.tableUsers = $('#table-users')
        this.dialogAddUser = jQuery('#dialog-add-user')
        this.dialogDeleteUser = jQuery('#dialog-delete-user')
        this.dialogEditUser = jQuery('#dialog-edit-user')
        this.displayAll()
    }
    editUser(id) {
        this.api.get(id, (status, user) => {
            if (status === 200) {
                $("#edit-user-id").value = id
                $("#edit-user-mail").value = user.mail
                $("#edit-user-name").value = user.name
                $("#edit-user-password").value = user.password
                this.dialogEditUser.modal('show')
            } else if (status === 404) {
                alert("user inconnu")
            }
        })
    }
    updateUser() {
        this.api.update($("#edit-user-id").value,
            new User($("#edit-user-mail").value, $("#edit-user-name").value, $("#edit-user-password").value),
            (status) => {
                this.displayAll()
                this.dialogEditUser.modal('hide')
            })
        return false
    }
    deleteUser(id) {
        this.api.get(id, (status, user) => {
            if (status === 200) {
                $("#label-delete-user").innerText = `${user.login}`
                $("#btn-delete-user").onclick = () => {
                    this.api.delete(id, (status) => {
                        this.displayAll()
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
        this.api.insert(new User($('#add-user-mail').value, $('#add-user-name').value, $('#add-user-password').value), (status) => {
            if (status === 200) {
                this.displayAll()
                this.dialogAddUser.modal('hide')
                $('#add-user-mail').value = ""
                $('#add-user-name').value = ""
                $('#add-user-password').value = ""
            }
        })
        return false
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
                                onclick="ctrl.deleteUser(${user.id})">X</button>
                        <button class="btn btn-warning btn-sm" 
                                onclick="ctrl.editUser(${user.id})">E</button></td>
                    </tr>`
            }
            this.tableUsers.innerHTML = table
        })
    }

}

const ctrl = new UserController();