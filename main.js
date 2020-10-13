const express = require('express')
let f;
let result;
let str;
let longest;
let word;
const app=express()
const mainUrl = '/api/Simachev/lab1/';
app.set('view engine', 'hbs');

const title = 'WEB'

const bodyParser = require('body-parser');

const passport = require('./passport').passport;

const flash = require('connect-flash')

const initDatabase = require('./db').initDatabase;


const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const keys = require('./key');

const router = require("express").Router()

initDatabase()

app.set('view engine', 'hbs');


app.use(express.static("public"));

app.use(cookieSession({
    name: 'session',
    keys: [keys.session.cookieSecret],
    maxAge: 100000,
    secure: false,
    signed: true
}));

app.use(cookieParser()); // ?????
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const loginPage = "api/Simachev/lab1/log";
const registerPage = "api/Simachev/lab1/reg";

app.use(express.static(__dirname + '/public'));

const hbs =require("hbs");

hbs.registerPartials("./views/partials/");

let header_data = {
    title: title,
    username: undefined,
    task1: '/api/Simachev/lab1/task1',
    task2: '/api/Simachev/lab1/task2',
    task3: '/api/Simachev/lab1/task3'
}


app.get('/' + loginPage, function (req, res) {

    let options = {
        ...header_data,
        ...{
            loginPath: '/api/Simachev/lab1/log'
        }
    }

    res.render('log.hbs', options);
});

app.get("/api/Simachev/lab1/reg", function (req, res) {
    let options = {
        ...header_data,
        ...{
            registerPath: "/api/Simachev/lab1/reg"
        }
    }

    res.render('reg.hbs', options);
});


app.post("/api/Simachev/lab1/log", passport.authenticate('login', {
    successRedirect: "/api/Simachev/lab1/main",
    failureRedirect: "/api/Simachev/lab1/reg",
    failureFlash: true
}));

app.post("/api/Simachev/lab1/reg", passport.authenticate('register', {
    successRedirect: "/api/Simachev/lab1/log",
    failureRedirect: "/api/Simachev/lab1/reg",
    failureFlash: true
}));


app.get('/api/Simachev/lab1/main', function (req, res) {
    res.render('main.hbs');
})

const fs = require('fs')


app.use(function (req, res, next)
{
    let ur = req.url;
	console.log(Date(), ur);
	next();
});



// TASK 2 ///////////////////////////
app.get('/api/Simachev/lab1/task_1', function (req, res) {
    res.render('task1.hbs');
})
function getComboVombos(smth) {
    result = [];
    f = function(prefix, smth) {
        for (let i = 0; i < smth.length; i++) {
            result.push(prefix+smth[i]);
            f(prefix + smth[i]+',', smth.slice(i + 1));
        }
    }

    f('', smth);
    return result;
}

/////////////////////////////////////

// TASK 5 ///////////////////////////
app.get('/api/Simachev/lab1/task_2', passport.authenticate("cookie",
    {
        failureRedirect: "/api/Simachev/lab1/reg",
        failureFlash: true
    }), function (req, res) {
    res.render('task2.hbs');
})
function longestWord(string) {
    str = string.split(" ");
    longest = 0;
    word = null;
    for (let i = 0; i < str.length; i++) {
        if (longest < str[i].length) {
            longest = str[i].length;
            word = str[i];
        }
    }
    return word;
}
///////////////////////////////////

app.get('/api/Simachev/lab1/tech', function (req, res) {
    res.render('tech.hbs');
})




app.get('/api/Simachev/lab1/task_3',passport.authenticate("cookie",
    {
        failureRedirect: "/api/Simachev/lab1/reg",
        failureFlash: true
    }), function (req, res) {
    res.render('task3.hbs');
})

// TASK 18 ////////////////////////
function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}


function adminCheck(req, res, next)
{
if (req.query.admin=="admin")
{
    next();
}
else {
    let err = new Error("FORBIDDEN");
    err.status = 403;
    next(err);
}
}

//////////////////////////////

app.get(mainUrl + "task1", function (req, res, next) {
    let param = req.query.smth;

    if (param === undefined) {
        let err = new Error("BAD REQUEST");
        err.status = 400;
        next(err);
        return;
    }

    let array = [];
    let ar = param.split(',');
    let arrra = getComboVombos(ar);
    for (let k=0; k<arrra.length; k++)
    {
    	array[k] = arrra[k].split(',');
    	for (let q=0; q< array[k].length; q++)
    	{
    		array[k][q]=Number(array[k][q]);
    	}
    }
    array.push([ ]);
    res.render("task1_ans.hbs", {title: "Answer", answer: array});

    // res.send(array);
});

app.get(mainUrl + "task2", adminCheck, function (req, res, next) {
    let param = req.query.smth;

    if (param === undefined) {
        let err = new Error("BAD REQUEST");
        err.status = 400;
        next(err);
        return;
    }

    let strr = param;

    res.render("task1_ans.hbs", {title: "Answer", answer: longestWord(strr)});
    //res.send(longestWord(strr));
});


app.get(mainUrl + "task3", adminCheck, function (req, res) {
let param = req.query.smth;

	delay(param).then(() => res.render("task1_ans.hbs", {title: "Answer", answer: param + ' ms'})); //res.send(param + ' ms'));

});

app.use((req, res, next) => {
    let err = new Error("NOT FOUND");
    err.status = 404;
    next(err);
})


app.use((err, req, res, next) => {
    if (err.status === undefined || err.status != 400 || err.status != 403 || err.status != 404)
    {
        err.status = 500;
    }
    res.status(err.status)
    fs.appendFile('log.log',   Date()+ ' '  + 'Status: ' + err.status + ' '+ 'message: ' + err.message + req.url, function(error){})
    res.json({
        status: err.status,
        message: err.message
    })


})


 app.use('/', router);
 app.listen(3000)