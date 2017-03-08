var express = require('express');
var app = express();


// Secure Hash Algorithm 1
var sha1 = require('sha1');


// Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Mongoose auto-increment
// Usage: https://www.npmjs.com/package/mongoose-auto-increment
var autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection("mongodb://localhost:27017/database");
autoIncrement.initialize(connection);

// DB Models
var User = require('./database/users.js')(connection, Schema, autoIncrement);

// for testing: add admin account
var admin = new User({
    userName: "admin",
    password: sha1("admin"),
    isAdmin: true
});
admin.save(function (err, admin) {
    if (err) return console.error(err);
    admin.test();
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


app.listen(3000, function () {
    console.log('App listening on port 3000');
});