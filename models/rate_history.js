module.exports = function (connection, Schema, autoIncrement) {
    var RateHistorySchema = new Schema({
        // todo
    });

    return connection.model('RateHistory', RateHistorySchema);
}
