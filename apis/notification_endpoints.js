module.exports = function (app, NotificationSetting, NotificationHistory) {
    // get user's notification settings
    app.get("/notification_settings", function (req, res) {
        if (req.auth)
        {
            NotificationSetting.findOne({'personId': req.userID}, 'enableTypeNumbers', function (err, notificationSettings) {
                if (err) {
                    console.error(err);
                }
                if (!notificationSettings.length) {
                    res.json(notificationSettings);
                } else {
                    return res.status(400).json({
                        status: 404,
                        message: "Get notification settings failed: person may not exist."
                    });
                }
            });
        } else
        {
            return res.status(401).json({
                status: 404,
                message: "Get notification settings failed: unauthorized or token expired."
            });
        }
    });

    // update user's notification settings
    app.put("/notification_settings", function (req, res) {
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
            return res.status(401).json({
                status: 404,
                message: "Upload notification settings failed: unauthorized or token expired."
            });
        }
    });
};