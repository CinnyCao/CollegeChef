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
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection("mongodb://localhost:27017/database");
autoIncrement.initialize(connection);

// DB Models
var User = require('./models/users.js')(connection, Schema, autoIncrement);
var Recipe = require('./models/recipes.js')(connection, Schema, autoIncrement);
var Category = require('./models/categories.js')(connection, Schema, autoIncrement);
var Ingredient = require('./models/ingredients.js')(connection, Schema, autoIncrement);
var IngredientToRecipe = require('./models/ingredient_to_recipe.js')(connection, Schema, autoIncrement);
var Comment = require('./models/comments.js')(connection, Schema, autoIncrement);
var RateHistory = require('./models/rate_history.js')(connection, Schema, autoIncrement);
var FavoriteHistory = require('./models/favorite_history.js')(connection, Schema, autoIncrement);
var NotificationSetting = require('./models/notification_settings.js')(connection, Schema, autoIncrement);
var NotificationHistory = require('./models/notification_history.js')(connection, Schema, autoIncrement);

// for testing: add admin account
User.findOne({userName: "admin"}, function (err, adminUser) {
   if (err) {
       var admin = new User({
           userName: "admin",
           password: sha1("admin"),
           isAdmin: true
       });
       admin.save(function (err, admin) {
           if (err) return console.error(err);
           admin.test();
       });
   } else {
       adminUser.test();
   }
});


// body parser to make sure every post request body is not empty
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.post('*', jsonParser, function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    next();
});


// Share endpoints
require('./apis/shared_endpoints.js')(app);

// Endpoints that process forms
require('./apis/forms_endpoints.js')(app);

// Home Page endpoints
require('./apis/home_endpoints.js')(app, Recipe, Ingredient);

// Recipe View endpoints
require('./apis/recipe_view_endpoints.js')(app);

// Recipe Browser endpoints
require('./apis/recipe_browser_endpoints.js')(app);

// User Profile endpoints
require('./apis/user_profile_endpoints.js')(app);


app.listen(3333, function () {
    console.log('App listening on port 3333');
});