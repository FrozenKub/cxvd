const express = require('express')
var f;
var result;
var str;
var longest;
var word;
const app=express()
const mainUrl = '/api/Simachev/lab1/';

// TASK 2 ///////////////////////////
function getComboVombos(smth) {
    result = [];
    f = function(prefix, smth) {
        for (var i = 0; i < smth.length; i++) {
            result.push(prefix + smth[i]);
            f(prefix + smth[i], smth.slice(i + 1));
        }
    }
    f(' ', smth);
    return result;
}

let t1 = getComboVombos([1,2,3,4,5]);
console.log("1) All combo-vobos: " + getComboVombos([1,2,3,4,5]))
/////////////////////////////////////

// TASK 5 ///////////////////////////
function longestWord(string) {
    str = string.split(",");
    longest = 0;
    word = null;
    for (var i = 0; i < str.length; i++) {
        if (longest < str[i].length) {
            longest = str[i].length;
            word = str[i];
        }
    }
    return word;
}
var t2 = longestWord("Ayayaya,Oyoyoyoyoyoyo")
console.log("2) Longest word is: " + longestWord("Ayayaya Oyoyoyoyoyoyo"));
///////////////////////////////////

// TASK 18 ////////////////////////
function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}



//////////////////////////////////

app.get(mainUrl + "task1", function (req, res) {
    let param = req.query.smth;

    if (param === undefined) {
        res.send("Incorrect data");
        return;
    }

    var ar = param.split(',').map(Number);

    res.send(getComboVombos(ar));
});

app.get(mainUrl + "task2", function (req, res) {
    let param = req.query.smth;

    if (param === undefined) {
        res.send("Incorrect data");
        return;
    }

    var strr = param;

    res.send(longestWord(strr));
});


app.get(mainUrl + "task3", function (req, res) {

	delay(3000).then(() => res.send('3 seconds passed!'));
    
});


 app.get('/t1', function(request, response) {
     response.send(`<h1>${t1}</h1>`)
 })
 app.get('/t2', function(request, response) {
     response.send(`<h1>${t2}</h1>`)
 })
app.get('/t3', function(request, response) {
    response.send(`<h1>"Hehe, boy"</h1>`)
})
 app.listen(3001)