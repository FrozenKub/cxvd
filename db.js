const mongoose = require('mongoose');
const uri = require('./key').mongodb.uri
const User = require("./user").User
const argon = require("argon2")


async function addNewUser(username, password) {

    const hashPass = await argon.hash(password);
    let addUser = new User({
        username: username,
        password: hashPass
    });
    argon.verify(hashPass, password).then(() => {
        addUser.save().then(() => {
            console.log("New user here");
        });
    })
    return addUser;
}


function initDB() {
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("DATABASE IS CONNECTED");
    });
}

exports.initDatabase = initDB;
exports.uploadUser = addNewUser;

