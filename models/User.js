const mongoose = require('mongoose');
const Role = require("./../models/Role");
var encryption = require("../utilities/encryption.js");


let userSchema = mongoose.Schema(
    {
        email : {type: String, required: true, unique:true },
        passwordHash : {type: String, required: true},
        fullName : {type: String, required: true},
        articles : [{type: mongoose.Schema.Types.ObjectId, ref:'Article'}],
        roles : [{type: mongoose.Schema.Types.ObjectId, ref:'Role'}],
        salt : {type: String, required: true},
    }
);

userSchema.method({
    authenticate: function(password){
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        if(inputPasswordHash=== this.passwordHash){
            return true;
        }
    }
});

const User  = mongoose.model('User', userSchema);
module.exports = User;


module.exports.seedAdmin = () => {
 let email = "admin@softuni.bg";
    User.findOne({email: email}).then(admin => {

        if(!admin){
            Role.findOne({name: 'Admin'}).then(role => {

                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(admin,salt);

                let roles = [];

                roles.push(role.id);

                let userObject = {
                    email: email,
                    passwordHash : passwordHash,
                    fullName : 'Admin',
                    articles: [],
                    salt : salt,
                    roles: roles
                };

                User.create(userObject).then(user => {
                    role.users.push(user.id);
                    role.save(err => {
                        if(err){
                            console.log(err.message)
                        }else{
                            console.log('Admin seeded successfully!')
                        }

                    })

                })



            })
        }

    })



};

