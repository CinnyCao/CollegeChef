var express = require('express');
var app = express();


// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection("mongodb://localhost:27017/database");
connection.on('error', console.error.bind(console, 'connection error: (Do you forget to run mongod?)'));
connection.once('open', function() {
    console.log("Database ready on port 27017");

    // Mongoose auto-increment
    // Usage: https://www.npmjs.com/package/mongoose-auto-increment
    var autoIncrement = require("mongoose-auto-increment");
    autoIncrement.initialize(connection);

    var Schema = mongoose.Schema;

    // DB Models
    var User = require('./models/users.js')(connection, Schema, autoIncrement);
    var Recipe = require('./models/recipes.js')(connection, Schema, autoIncrement);
    var Category = require('./models/categories.js')(connection, Schema, autoIncrement);
    var Ingredient = require('./models/ingredients.js')(connection, Schema, autoIncrement);
    var IngredientToRecipe = require('./models/ingredient_to_recipe.js')(connection, Schema, autoIncrement);
    var Comment = require('./models/comments.js')(connection, Schema, autoIncrement);
    var Rate = require('./models/rate.js')(connection, Schema, autoIncrement);
    var Favorite = require('./models/favorite.js')(connection, Schema, autoIncrement);
    var NotificationSetting = require('./models/notification_settings.js')(connection, Schema, autoIncrement);
    var NotificationHistory = require('./models/notification_history.js')(connection, Schema, autoIncrement);

    // Secure Hash Algorithm 1
    var sha1 = require('sha1');

    // Reads bearer authorization token
    var bearerToken = require('express-bearer-token');
    app.use(bearerToken());

    // JSON web token
    var jwt = require('jwt-simple');
    var secret = 'QbSqjf3v1V2sMHyeo27W';

    // Function for generating token
    var generateToken = function (userID) {
        var date = new Date();
        var payload = {
            userID: userID,
            exp: date.setHours(date.getHours() + 17532)
        };
        return jwt.encode(payload, secret);
    };

    // body parser to make sure every post request body is not empty
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json();
    app.post('*', jsonParser, function (req, res, next) {
        if (!req.body) {
            console.error("Request body not found");
            return res.sendStatus(400);
        }
        next();
    });

    // Authentication
    app.all('*', jsonParser, function (req, res, next) {
        if (req.token) {
            var decodedToken = jwt.decode(req.token, secret);
            if (decodedToken && new Date(decodedToken.exp) > new Date()) {
                User.find({id: decodedToken.userID}, function (err, resUsers) {
                    if (err) return console.error(err);
                    if (resUsers.length) {
                        req.auth = true;
                        req.userName = resUsers[0].userName;
                        req.isAdmin = resUsers[0].isAdmin;
                    } else {
                        // user not found, set auth failed
                        req.auth = false;
                    }
                    next();
                });
            } else {
                // token expired? set auth failed
                req.auth = false;
                next();
            }
        } else {
            // token not passed, leave auth not set
            next();
        }
    });

    // // testing only - clear database
    // connection.dropDatabase(function () {
    //     console.log("Database cleared");
        // factory database prepration
        require('./apis/builtIn_records.js')(app, sha1, User, Ingredient);
    // });

    // Share endpoints
    require('./apis/shared_endpoints.js')(app);

    // Endpoints that process forms
    require('./apis/forms_endpoints.js')(app, sha1, generateToken, User);

    // Home Page endpoints
    require('./apis/home_endpoints.js')(app, Recipe, Ingredient);

    // Recipe View endpoints
    require('./apis/recipe_view_endpoints.js')(app);

    // Recipe Browser endpoints
    require('./apis/recipe_browser_endpoints.js')(app);

    // User Profile endpoints
    require('./apis/user_profile_endpoints.js')(app, User, NotificationSetting, NotificationHistory);

    var server = app.listen(3000, function () {
        console.log('App listening on port 3000');
    });

    var shutdown = function() {
        console.log("Shutting down...");
        connection.close(function () {
            console.log('Mongoose connection closed.');
            console.log("Byebye");
            process.exit(0);
        });
    }

    // listen for TERM signal .e.g. kill
    process.on ('SIGTERM', shutdown);

    // listen for INT signal e.g. Ctrl-C
    process.on ('SIGINT', shutdown);
});