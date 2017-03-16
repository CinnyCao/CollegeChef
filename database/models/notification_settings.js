module.exports = function (connection, Schema, autoIncrement) {
    var NotificationSettingSchema = new Schema({
        personId: {type: Number, required: true, ref: 'User'},
        typeNumber: {type: Number, required: true, min: 1, max: 5},
        enable: {type: Boolean, required: true, default: true}
    });
    
    NotificationSettingSchema.plugin(autoIncrement.plugin, 'NotificationSetting');

    return connection.model('NotificationSetting', NotificationSettingSchema);
};
