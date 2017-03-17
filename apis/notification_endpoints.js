module.exports = function (app, NotificationSetting, NotificationHistory) {
    // get user's notification settings
    app.get('/notification_settings', function (req, res) {
        NotificationSetting.findOne({'personId': req.userID, 'enable': true}, 'typeNumber', function (err, notificationSettings) {
            if (err) {
                console.error(err);
            }
            if (!notificationSettings.length) {
                return res.sendStatus(403);
            } else {
                res.json(notificationSettings);
            }
        });
    });

};