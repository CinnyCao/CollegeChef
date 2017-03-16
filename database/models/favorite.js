module.exports = function (connection, Schema, autoIncrement) {
    var FavoriteSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'}
    });
    
    FavoriteSchema.plugin(autoIncrement.plugin, 'Favorite');

    return connection.model('Favorite', FavoriteSchema);
};
