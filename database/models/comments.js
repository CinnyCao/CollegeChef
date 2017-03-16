module.exports = function (connection, Schema, autoIncrement) {
    var CommentSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        // 0 for url, 1 for text
        type: {type: Number, required: true, min: 0, max: 1},
        message: {type: String, required: true}
    });

    CommentSchema.plugin(autoIncrement.plugin, 'Comment');

    return connection.model('Comment', CommentSchema);
};
