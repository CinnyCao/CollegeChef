module.exports = function (connection, Schema, autoIncrement, NotificationSetting) {
    var UserSchema = new Schema({
        userName: {type: String, required: true, unique: true},
        email: String,
        // password is sha1 encoded result of userName + password
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        description: String,
        profilePhoto: String
    });

    UserSchema.plugin(autoIncrement.plugin, 'User');

    UserSchema.methods.addNotificationSettings = function () {
        var personId = this._id;
        NotificationSetting.find({'personId': personId}, function (err, records) {
            if (err)
                return console.error(err);
            if (!records.length) {
                var notificationSettings = [
                    {personId: personId}
                ];
                NotificationSetting.create(notificationSettings, function (err, setNotificationSettings) {
                    if (err)
                        return console.error(err);
                    if (setNotificationSettings.length)
                    {
                        console.log("Notification Settings insert successfully for user " + personId);
                    }
                });
            }
        });
    };

    UserSchema.methods.introduce = function () {
        var greeting = "User " + this.userName + " created. " + (this.isAdmin ? "It's an Admin" : "It's a normal User");
        console.log(greeting);
    };

    return connection.model('User', UserSchema);
};
