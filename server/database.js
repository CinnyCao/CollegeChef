var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: add our database schema here: check here for types: http://mongoosejs.com/docs/schematypes.html
var UsersSchema = new Schema(

);

var RecipesSchema = new Schema(

);

var IngredientsSchema = new Schema(

);

var IngredientToRecipeSchema = new Schema(

);

var CategoriesSchema = new Schema(

);

var CommentsSchema = new Schema(

);

var RateHistorySchema = new Schema(

);

var FavoriteHistorySchema = new Schema(

);

var NotificationSettingsSchema = new Schema(

);

var NotificationHistorySchema = new Schema(

);

mongoose.connect('mongodb://localhost:27017/collegechef');

var Users = mongoose.model('Users', UsersSchema);
var Recipes = mongoose.model('Recipes', RecipesSchema);
var Ingredients = mongoose.model('Ingredients', IngredientsSchema);
var Categories = mongoose.model('Categories', CategoriesSchema);
var Comments = mongoose.model('Comments', CommentsSchema);
var RateHistory = mongoose.model('RateHistory', RateHistorySchema);
var FavoriteHistory = mongoose.model('FavoriteHistory', FavoriteHistorySchema);
var NotificationSettings = mongoose.model('NotificationSettings', NotificationSettingsSchema);
var NotificationHistory = mongoose.model('NotificationHistory', NotificationHistorySchema);

// save model in variables for easy saving and so on: see http://mongoosejs.com/docs/models.html


// TODO: check if db is empty or not, if empty insert data to db