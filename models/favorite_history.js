module.exports = function (connection, Schema, autoIncrement) {
    var FavoriteHistorySchema = new Schema({
        // todo
    });

    return connection.model('FavoriteHistory', FavoriteHistorySchema);
}
