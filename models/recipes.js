module.exports = function (connection, Schema, autoIncrement) {
    var RecipeSchema = new Schema({
        // todo
    });

    return connection.model('Recipe', RecipeSchema);
}
