const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const User = require('./user').User
const uploadUser = require('./db').uploadUser;

const loginStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (!user) {
                return done(null, false, {message: "Either Password or Username is Incorrect (May be Both though)"});
            }

            user.validatePassword(password).then((result) => {
                console.log(typeof result);
                if (result) {
                    return done(null, user);
                }

                return done(null, false, {message: "Either Password or Username is Incorrect (May be Both though)"});
            });


        });
    }
);

const registerStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        console.log("HERE");
        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (user) {
                console.log("You are not Alone in this world. There is one " + user.username + " already.");
                return done(null, false, {message: "You are not the only user here."});
            }

            uploadUser(username, password).then((newUser) => {
                if (newUser) {
                    return done(null, newUser);
                }
                console.log("Something is dead over here.")
                return done(null, false, {message: "Something went horribly wrong."});

            });


        });
    }
);

const cookieStrategy = new CookieStrategy({
    cookieName: 'session',
    passReqToCallback: true
}, function (req, session, done) {
    if (!req.user)
    {
        console.log("NOT AUTH");
        return done(null, false, {message: "You are not authorized. This is cool though, try it."});
    }
    User.findOne({username: req.user.username}, function (err, user) {
        if (err)
        {
            console.log("WTF");
            throw (err);
        }
        if (user) {
            console.log("AUTH");
            return done(null, user);
        }
        console.log("NOT AUTH");
        return done(null, false, {message: "Authorize, m8."});
    });

});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use('login', loginStrategy);
passport.use('register', registerStrategy);
passport.use('cookie', cookieStrategy);


exports.passport = passport;