module.exports = function (connection, Schema, autoIncrement) {
    var IngredientSchema = new Schema({
        name: {type: String, required: true, unique: true},
        imgUrl: {type: String, required: true}
    });

    IngredientSchema.plugin(autoIncrement.plugin, {model: 'Ingredient', field: 'id'});

    return connection.model('Ingredient', IngredientSchema);
}
