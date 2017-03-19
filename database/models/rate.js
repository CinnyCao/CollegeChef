module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var RateSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        scores: {type: Number, required: true, min: 1, max: 5}
    });
    
    RateSchema.plugin(autoIncrement.plugin, 'Rate');

    RateSchema.methods.addRateNotification = function (personId, operatorId) {
        var notification = new NotificationHistory({
            personId: personId,
            operatorId: operatorId,
            typeNumber: 0
        });
        notification.save(function (err) {
            if (err)
                return console.error(err);
        });
    };
    return connection.model('Rate', RateSchema);
};
