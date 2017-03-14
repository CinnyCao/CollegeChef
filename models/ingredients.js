module.exports = function (connection, Schema, autoIncrement) {
    var IngredientSchema = new Schema({
        name: {type: String, required: true, unique: true},
        imgUrl: {type: String, required: true}
    });

    IngredientSchema.plugin(autoIncrement.plugin, {model: 'Ingredient', field: 'id'});

    IngredientSchema.methods.check = function () {
        var greeting = "Ingredient #" + this.id + " " + this.name + " purchased. Linked with image at " + this.imgUrl;
        console.log(greeting);
    };

    return connection.model('Ingredient', IngredientSchema);
};
