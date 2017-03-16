module.exports = function (connection, Schema, autoIncrement) {
    var NotificationHistorySchema = new Schema({
        personId: {type: Number, required: true, ref: 'User'},
        typeNumber: {type: Number, required: true, min: 1, max: 5},
        createdDate: {type: Date, default: Date.now}
    });
    
    NotificationHistorySchema.plugin(autoIncrement.plugin, 'NotificationHistory');

    return connection.model('NotificationHistory', NotificationHistorySchema);
};
