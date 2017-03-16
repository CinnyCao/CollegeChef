module.exports = function (connection, Schema, autoIncrement) {
    var RecipeSchema = new Schema({
        personId: {type: Number, required: true, ref: 'User'},
        recipeName: {type: String, required: true},
        ModifiedDate: {type: Date, required: true, default: Date.now},
        ModifiedById: {type: Number, required: true, ref: 'User', default: this.personId},
        ingredientIds: {type: Number, ref: 'Ingredient', requried: true},
        categoryId: {type: Number, required: true, ref: 'Category'},
        description: {type: String, required: true},
        instruction: {type: String, required: true},
        imgUrl: {type: String, required: true},
        numServings: {type: Number, required: true, min: 1},
        notes: String
    });

    RecipeSchema.plugin(autoIncrement.plugin, 'Recipe');

    return connection.model('Recipe', RecipeSchema);
};
