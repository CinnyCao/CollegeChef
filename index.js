var express = require('express');
var app = express();



// Secure Hash Algorithm 1
var sha1 = require('sha1');


// MongoDB
var mongo = require('./database/dbconnection.js');
mongo.connectToServer(function(err) {
    // Database is ready; listen on port 3000
    app.listen(3000, function () {
        console.log('App listening on port 3000');
    });
});

// MongoDB auto-increment
var autoIncrement = require("mongodb-autoincrement");

// DB Schema and Models
var Users = require('./database/users.js');

// for testing: add admin account
autoIncrement.getNextSequence(mongo.getDB(), 'Users', function (err, autoIndex) {
    var admin = new User({
        id: autoIndex,
        userName: "admin",
        password: sha1("admin"),
        isAdmin: true
    });
});


// body parser to make sure every post request body is not empty
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.post('*', jsonParser, function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    next();
});



// Endpoints that process forms


// Home Page endpoints


// Recipe View endpoints


// Recipe Browser endpoints


// User Profile endpoints


