module.exports = function (connection, Schema, autoIncrement) {
    var NotificationSettingSchema = new Schema({
        // todo
    });

    return connection.model('NotificationSetting', NotificationSettingSchema);
}
