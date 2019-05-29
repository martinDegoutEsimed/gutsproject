const User = require('./user')
const tools = require("../web/js/tools2");

module.exports = class Seeder {

    constructor(userDAO, done){
        this.userDAO = userDAO
    }

    init(){
        this.createTable();
    }

    checkTables(DAO,tableName){
        let exists = false;
        DAO.db.run("SELECT * FROM sqlite_master WHERE name =" + tableName + " and type='table'; ",
            (err) => {
            if(err == null){
                exists = true;
            }
        });

        return exists;
    }

    createTable(){
        this.createUser();
    }

    /*createTableUser(callbackSuccess){
        this.userDAO.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, passwordhash TEXT)",[], callbackSuccess);
    }

    createUser(){
        this.userDAO.insert(new User("User1", "azerty"));
    }*/

    createUser(){
        this.userDAO.db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, mail TEXT, name TEXT, passwordhash TEXT)",
            (err) => {
                if (err == null) {
                    this.userDAO.insert(new User("user1@mail.com", "user1", "azerty"))
                }
        })
    }

};