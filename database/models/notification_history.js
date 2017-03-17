module.exports = function (connection, Schema, autoIncrement) {
    var NotificationHistorySchema = new Schema({
        personId: {type: Number, required: true, ref: 'User'},
        // 0: uploaded recipe be rated; 1: uploaded recipe be commented
        // 2: uploaded recipe be favorited; 3: uploaded recipe be modified
        // 4: favorite recipe be modified
        typeNumber: {type: Number, required: true, enum: [0, 1, 2, 3, 4]},
        createdDate: {type: Date, default: Date.now}
    });

    NotificationHistorySchema.plugin(autoIncrement.plugin, 'NotificationHistory');

    return connection.model('NotificationHistory', NotificationHistorySchema);
};
