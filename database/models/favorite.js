module.exports = function (connection, Schema, autoIncrement) {
    var FavoriteSchema = new Schema({
        recipeId: {type: Schema.ObjectId, required: true, ref: 'Recipe'},
        personId: {type: Schema.ObjectId, required: true, ref: 'User'}
    });
    
    FavoriteSchema.plugin(autoIncrement.plugin, {model: 'Favorite', field: 'id'});

    return connection.model('Favorite', FavoriteSchema);
};
