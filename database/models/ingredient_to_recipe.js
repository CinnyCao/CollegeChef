module.exports = function (connection, Schema, autoIncrement) {
    var IngredientToRecipeSchema = new Schema({
        ingredientId: {type: Number, required: true, ref: 'Ingredient'},
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        amount: {type: String, required: true}
    });
    
    IngredientToRecipeSchema.plugin(autoIncrement.plugin, 'IngredientToRecipe');

    return connection.model('IngredientToRecipe', IngredientToRecipeSchema);
};
