module.exports = function (connection, Schema, autoIncrement) {
    var CategorySchema = new Schema({
        // todo
    });

    return connection.model('Category', CategorySchema);
}
