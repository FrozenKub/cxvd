

const Tweet = require("./models/Tweet");
const User = require("./models/User");

module.exports = async()=> {




    User.hasMany(Tweet, {as: "Tweet", foreignKey: 'userId'})
    Tweet.belongsTo(User, {as: "User", foreignKey: "userId" })

    const errHandler = (err) => {
        console.error("Error: ", err);
    }

    const user = await User.create({username: "alexander", passwd: '123456789', gender: 'helicopter'}).catch(errHandler);

    const tweet = await Tweet.create({
        content: "Hehe",
        userId: user.id
    }).catch(errHandler);


    const users = await User.findAll({
        where: {username: 'alexander'},
        include: [ { model: Tweet, as: "Tweet" } ]
    }).catch(errHandler);


    console.log("Alex tweets: ", JSON.stringify(users));
};