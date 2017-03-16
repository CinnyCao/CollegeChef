module.exports = function (connection, Schema, autoIncrement, IngredientToRecipe) {
    var RecipeSchema = new Schema({
        personId: {type: Number, required: true, ref: 'User'},
        recipeName: {type: String, required: true},
        ModifiedDate: {type: Date, default: Date.now},
        ModifiedById: {type: Number, ref: 'User', default: this.personId},
        categoryId: {type: Number, required: true, ref: 'Category'},
        description: {type: String, required: true},
        instruction: {type: String, required: true},
        imgUrl: {type: String, required: true},
        numServings: {type: Number, required: true, min: 1},
        notes: String
    });

    RecipeSchema.plugin(autoIncrement.plugin, 'Recipe');

    RecipeSchema.methods.addIngredient = function (ingredientID, amount) {
        var recipeId = this._id;
        IngredientToRecipe.find({'recipeId': recipeId, 'ingredientId': ingredientID}, function (err, records) {
            if (err)
                return console.error(err);
            if (!records.length) {
                var newRecord = new IngredientToRecipe({'recipeId': recipeId, 'ingredientId': ingredientID, 'amount': amount});
                newRecord.save(function (err) {
                    if (err)
                        return console.error(err);
                    console.log("Added ingredient to recipe");
                });
            }
        });
    };

    return connection.model('Recipe', RecipeSchema);
};
