module.exports = function (connection, Schema, autoIncrement) {
    var NotificationHistorySchema = new Schema({
        // todo
    });

    return connection.model('NotificationHistory', NotificationHistorySchema);
}
