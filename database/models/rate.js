module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var RateSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        scores: {type: Number, required: true, min: 1, max: 5}
    });
    
    RateSchema.plugin(autoIncrement.plugin, 'Rate');

    RateSchema.methods.addRateNotification = function (recipeId, operatorId) {
        Recipe.findById(recipeId)
                .populate('personId')
                .exec(function (err, recipe) {
                    if (err)
                        return console.error(err);
                    var notification = new NotificationHistory({
                        personId: recipe.personId._id,
                        operatorId: operatorId,
                        typeNumber: 0
                    });
                    notification.save(function (err2) {
                        if (err2)
                            return console.error(err2);
                    });
                });
    };
    return connection.model('Rate', RateSchema);
};
