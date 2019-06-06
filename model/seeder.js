const User = require('./user')
const Challenge = require('./challenge');
const Comment = require('./comment');
const tools = require("../web/js/tools2");

module.exports = class Seeder {

    constructor(userDAO, challengeDAO, commentDAO, done){
        this.userDAO = userDAO;
        this.challengeDAO = challengeDAO;
        this.commentDAO = commentDAO;
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
        this.createTableLike();
        this.createComment();
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
                    this.userDAO.insert(new User(null, "user1@mail.com", "user1", "azerty"))
                    this.userDAO.insert(new User(null, "user2@mail.com", "user2", "azerty"))
                }
        })
    }

    createTableLike(){
        this.userDAO.db.run("CREATE TABLE likes (id_user INTEGER, id_challenge INTEGER)")
    }

    createChallenge(){
        this.challengeDAO.db.run("CREATE TABLE challenge (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            " title TEXT," +
            " description TEXT," +
            " likes INTEGER," +
            " dateCreation TEXT," +
            " author TEXT," +
            " done INTEGER," +
            " hidden INTEGER)",
            (err) => {
                if (err == null) {
                    this.challengeDAO.db.serialize(() => {
                        for (let i = 1; i < 3; i++) {
                            this.challengeDAO.insert(
                                new Challenge("Défi" + i, "Exemple Description", 0, "0" + i + "/05/2019", "user1", 0, 0));
                        }
                        this.challengeDAO.insert(new Challenge("Défi Facile", "Respire", 120, "01/05/2019", "user2", 1, 0));
                        this.challengeDAO.insert(new Challenge("Défi Caché", "Oups", 0, "01/05/2019", "user1", 1, 1));
                    });
                }
            })
    }

    createComment(){
        this.commentDAO.db.run("CREATE TABLE comment (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            " author TEXT," +
            " comment TEXT," +
            " challenge INTEGER," +
            " proof TEXT," +
            " dateCreation TEXT)",
            (err) => {
                if (err == null) {
                    this.commentDAO.db.serialize(() => {
                        for (let i = 1; i < 3; i++) {
                            this.commentDAO.insert(
                                new Comment("user1", "Wow trop dur !", 1, null, "0" + i + "/05/2019"));
                        }
                    });
                }
            })
    }


};