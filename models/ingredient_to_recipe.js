module.exports = function (connection, Schema, autoIncrement) {
    var IngredientToRecipeSchema = new Schema({
        ingredientId: {type: Schema.ObjectId, required: true, ref: 'Ingredient'},
        recipeId: {type: Schema.ObjectId, required: true, ref: 'Recipe'},
        amount: {type: String, required: true}
    });
    
    IngredientToRecipeSchema.plugin(autoIncrement.plugin, {model: 'IngredientToRecipe', field: 'id'});

    return connection.model('IngredientToRecipe', IngredientToRecipeSchema);
};
