module.exports = function (connection, Schema, autoIncrement) {
    var IngredientSchema = new Schema({
        // todo
    });

    return connection.model('Ingredient', IngredientSchema);
}
