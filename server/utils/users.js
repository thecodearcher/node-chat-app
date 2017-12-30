class Users{
    constructor() {
        this.users = [];
    }

    addUser(id, name, room){
        let user ={id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
       let users = this.getUser(id);

       if(users){
           this.users = this.users.filter((user) => user.id !== id);
       }

       return users;
    }

    getUser(id){
        return this.users.filter((user)=>user.id === id)[0];
    }

    getUserList(room){
        let users =  this.users.filter((user)=>{
            return user.room === room;
        });

        let namesArray = users.map((user)=>{
            return user.name;
        });

        return namesArray;
    }
}

module.exports = {Users};