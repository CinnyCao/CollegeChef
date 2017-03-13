module.exports = function (connection, Schema, autoIncrement) {
    var FavoriteHistorySchema = new Schema({
        recipeId: {type: Schema.ObjectId, required: true, ref: "Recipe"},
        personId: {type: Schema.ObjectId, required: true, ref: "User"}
    });
    
    FavoriteHistorySchema.plugin(autoIncrement.plugin, {model: 'FavoriteHistory', field: 'id'});

    return connection.model('FavoriteHistory', FavoriteHistorySchema);
}
