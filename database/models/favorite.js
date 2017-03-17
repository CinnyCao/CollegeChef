module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var FavoriteSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'}
    });
    
    FavoriteSchema.plugin(autoIncrement.plugin, 'Favorite');

    FavoriteSchema.methods.addFavoriteNotification = function (personId, operatorId) {
        var notification = new NotificationHistory({
            personId: personId,
            operatorId: operatorId,
            typeNumber: 2
        });
        notification.save(function (err) {
            if (err)
                return console.error(err);
        });
    };
    return connection.model('Favorite', FavoriteSchema);
};
