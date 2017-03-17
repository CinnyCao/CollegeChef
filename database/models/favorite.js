module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var FavoriteSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'}
    });
    
    FavoriteSchema.plugin(autoIncrement.plugin, 'Favorite');

    FavoriteSchema.methods.addFavoriteNotification = function (recipeId, operatorId) {
        Recipe.findById(recipeId)
                .populate('personId')
                .exec(function (err, recipe) {
                    if (err)
                        return console.error(err);
                    var notification = new NotificationHistory({
                        personId: recipe.personId._id,
                        operatorId: operatorId,
                        typeNumber: 2
                    });
                    notification.save(function (err2) {
                        if (err2)
                            return console.error(err2);
                    });
                });
    };
    return connection.model('Favorite', FavoriteSchema);
};
