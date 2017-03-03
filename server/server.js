var express = require('express');

// Database
var DB = require('/server/database');

var app = express();

// body parser to make sure every post request body is not empty
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.post('*', jsonParser, function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    next();
});




app.listen(3000, function () {
    console.log('App listening on port 3000');
});

