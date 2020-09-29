const express = require('express')
let f;
let result;
let str;
let longest;
let word;
const app=express()
const mainUrl = '/api/Simachev/lab1/';
app.set('view engine', 'hbs');

const hbs =require("hbs");

hbs.registerPartials("./views/partials/");

app.get('/api/Simachev/lab1/main', function (req, res) {
    res.render('main.hbs');
})

const fs = require('fs')

const router = express.Router();

app.use(function (req, res, next)
{
    let ur = req.url;
	console.log(Date(), ur);
	next();
});



// TASK 2 ///////////////////////////
app.get('/api/Simachev/lab1/task_1', function (req, res) {
    res.render('task2.hbs');
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
app.get('/api/Simachev/lab1/task_2', function (req, res) {
    res.render('task1.hbs');
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


app.get('/api/Simachev/lab1/task_3', function (req, res) {
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
else res.send("You are not an admin!");
}

//////////////////////////////

app.get(mainUrl + "task1", function (req, res) {
    let param = req.query.smth;

    if (param === undefined) {
        res.send("Incorrect data");
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

app.get(mainUrl + "task2", adminCheck, function (req, res) {
    let param = req.query.smth;

    if (param === undefined) {
        res.send("Incorrect data");
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


app.get('/api/Simachev/lab1/WHATISTHAT', function (req, res) {
    res.render('dontknow.hbs');
})


app.use((req, res, next) => {
    next(createError(404))
})


app.use((err, req, res, next) => {
    if (err.status === undefined || (err.status <400 || err.status >599))
    {
        err.status = 500
    }
    res.status(err.status)
    fs.appendFile('log.log',   Date()+ ' '  + 'Status: ' + err.status + ' '+ 'message: ' + err.message + req.method, function(error){})
    res.json({
        status: err.status,
        message: err.message,
        stack: err.stack
    })


})


 app.use('/', router);
 app.listen(3000)