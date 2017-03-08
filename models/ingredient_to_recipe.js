module.exports = function (connection, Schema, autoIncrement) {
    var IngredientToRecipeSchema = new Schema({
        // todo
    });

    return connection.model('IngredientToRecipe', IngredientToRecipeSchema);
}
