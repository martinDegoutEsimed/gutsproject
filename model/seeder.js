const User = require('./user')
const Challenge = require('./challenge');
const tools = require("../web/js/tools2");

module.exports = class Seeder {

    constructor(userDAO, challengeDAO, done){
        this.userDAO = userDAO;
        this.challengeDAO = challengeDAO;
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
        this.createChallenge();
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

    createChallenge(){
        this.challengeDAO.db.run("CREATE TABLE challenge (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            " title TEXT," +
            " description TEXT," +
            " likes INTEGER," +
            " dateCreation TEXT," +
            " author TEXT)",
            (err) => {
                if (err == null) {
                    this.challengeDAO.db.serialize(() => {
                        for (let i = 1; i < 3; i++) {
                            this.challengeDAO.insert(
                                new Challenge("Challenge" + i, "Just Do it", 0, "0" + i + "/05/2019", "user1"));
                        }
                    });
                }
            })
    }


};