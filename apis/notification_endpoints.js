module.exports = function (app, NotificationSetting, NotificationHistory) {
    // get user's notification settings
    app.get('/notification_settings', function (req, res) {
        if (req.auth)
        {
            NotificationSetting.findOne({'personId': req.userID}, 'enableTypeNumbers', function (err, notificationSettings) {
                if (err) {
                    console.error(err);
                }
                if (!notificationSettings.length) {
                    return res.sendStatus(403);
                } else {
                    res.json(notificationSettings);
                }
            });
        } else
        {
            return res.sendStatus(401);
        }
    });

    // update user's notification settings
    app.put('/notification_settings', function (req, res) {
        if (req.auth)
        {
            if (req.body.enableTypeNumbers)
            {
                NotificationSetting.findOneAndUpdate({'personId': req.userID},
                        {enableTypeNumbers: req.body.enableTypeNumbers},
                        {new : true},
                        function (err, notificationSetting) {
                            if (err) {
                                console.error(err);
                            }
                            res.sendStatus(200);
                        });
            }
        } else
        {
            return res.sendStatus(401);
        }
    });
};