module.exports = function (connection, Schema, autoIncrement) {
    var CommentSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        isImage: {type: Boolean, required: true},
        message: {type: String, required: true}
    });

    CommentSchema.plugin(autoIncrement.plugin, 'Comment');

    return connection.model('Comment', CommentSchema);
};
