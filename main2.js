const express = require('express')
var f;
var result;
var str;
var longest;
var word;
const app=express()
const mainUrl = '/api/Simachev/lab1/';

const path = require('path');
const router = express.Router();

// TASK 2 ///////////////////////////
function getComboVombos(smth) {
    result = [];
    f = function(prefix, smth) {
        for (var i = 0; i < smth.length; i++) {
            result.push(prefix+smth[i]);
            f(prefix + smth[i]+',', smth.slice(i + 1));
        }
    }

    f('', smth);
    return result;
}
/////////////////////////////////////

// TASK 5 ///////////////////////////
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

    let array = [];
    var ar = param.split(',');
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
    res.send(array);
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
let param = req.query.smth;

	delay(param).then(() => res.send(param + ' ms'));
    
});


app.get(mainUrl + "id", function(request, response) {
    response.send("ID: " + request.query.id);
})


router.get(mainUrl + "html", function(request, response) {
    response.sendFile(path.join(__dirname+'/index.html'));
})

 app.use('/', router);
 app.listen(3000)