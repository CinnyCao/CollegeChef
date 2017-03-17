module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var CommentSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        isImage: {type: Boolean, required: true},
        message: {type: String, required: true}
    });

    CommentSchema.plugin(autoIncrement.plugin, 'Comment');

    CommentSchema.methods.addCommentNotification = function (recipeId, operatorId) {
        Recipe.findById(recipeId)
                .populate('personId')
                .exec(function (err, recipe) {
                    if (err)
                        return console.error(err);
                    var notification = new NotificationHistory({
                        personId: recipe.personId._id,
                        operatorId: operatorId,
                        typeNumber: 1
                    });
                    notification.save(function (err2) {
                        if (err2)
                            return console.error(err2);
                    });
                });
    };


    return connection.model('Comment', CommentSchema);
};
