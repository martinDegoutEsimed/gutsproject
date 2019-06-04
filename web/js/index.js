class IndexController{

    constructor(){
        this.welcomeName = $('#welcomeName')
        this.changeWelcome();
        //this.api = new UserService();
    }

    changeWelcome(){
        ctrlUser.getCurrentUser((user)=> {
            console.log(user)
            ctrlUser.getByMail(user.mail, (userFinal)=> {
                this.welcomeName.innerHTML = `<h5> Welcome ${userFinal.name} </h5>`;
            })

        })
    }
}
const ctrlIndex = new IndexController();