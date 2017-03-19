module.exports = function (connection, Schema, autoIncrement, NotificationHistory, Recipe) {
    var CommentSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        isImage: {type: Boolean, required: true},
        message: {type: String, required: true}
    });

    CommentSchema.plugin(autoIncrement.plugin, 'Comment');

    CommentSchema.methods.addCommentNotification = function (personId, operatorId) {
        var notification = new NotificationHistory({
            personId: personId,
            operatorId: operatorId,
            typeNumber: 1
        });
        notification.save(function (err) {
            if (err)
                return console.error(err);
        });
    };


    return connection.model('Comment', CommentSchema);
};
