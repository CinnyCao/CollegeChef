var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: add our database schema here: check here for types: http://mongoosejs.com/docs/schematypes.html
var UsersSchema = new Schema({
    id: {type: Number, required: true},
    userName: {type: String, required: true, unique: true},
    email: String,
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    description: String,
    profilePhoto: String
});

var RecipesSchema = new Schema({

});

var IngredientsSchema = new Schema({

});

var IngredientToRecipeSchema = new Schema({

});

var CategoriesSchema = new Schema({

});

var CommentsSchema = new Schema({

});

var RateHistorySchema = new Schema({

});

var FavoriteHistorySchema = new Schema({

});

var NotificationSettingsSchema = new Schema({

});

var NotificationHistorySchema = new Schema({

});


// save model in variables for easy saving and so on: see http://mongoosejs.com/docs/models.html
var Users = mongoose.model('Users', UsersSchema);
var Recipes = mongoose.model('Recipes', RecipesSchema);
var Ingredients = mongoose.model('Ingredients', IngredientsSchema);
var Categories = mongoose.model('Categories', CategoriesSchema);
var Comments = mongoose.model('Comments', CommentsSchema);
var RateHistory = mongoose.model('RateHistory', RateHistorySchema);
var FavoriteHistory = mongoose.model('FavoriteHistory', FavoriteHistorySchema);
var NotificationSettings = mongoose.model('NotificationSettings', NotificationSettingsSchema);
var NotificationHistory = mongoose.model('NotificationHistory', NotificationHistorySchema);


// TODO: check if db is empty or not, if empty insert data to db