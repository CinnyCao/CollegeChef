module.exports = function (connection, Schema, autoIncrement) {
    var NotificationHistorySchema = new Schema({
        personId: {type: Schema.ObjectId, required: true, ref: 'User'},
        typeNumber: {type: Number, required: true, min: 1, max: 5},
        createdDate: {type: Date, required: true, default: Date.now}
    });
    
    NotificationHistorySchema.plugin(autoIncrement.plugin, {model: 'NotificationHistory', field: 'id'});

    return connection.model('NotificationHistory', NotificationHistorySchema);
};
