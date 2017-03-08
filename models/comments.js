module.exports = function (connection, Schema, autoIncrement) {
    var CommentSchema = new Schema({
        // todo
    });

    return connection.model('Comment', CommentSchema);
}
