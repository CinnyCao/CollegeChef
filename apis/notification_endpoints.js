module.exports = function (app, NotificationSetting, NotificationHistory) {

    // get user's notification settings
    app.get("/notification_settings", function (req, res) {
        if (req.auth)
        {
            NotificationSetting.findOne({'personId': req.userID}, function (err, notificationSettings) {
                if (err) {
                    console.error(err);
                }
                if (notificationSettings)
                {
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

    // get notification history
    app.get("/notification", function (req, res) {
        if (req.auth)
        {
            NotificationSetting.findOne({'personId': req.userID}, function (err, notificationSettings) {
                if (err) {
                    console.error(err);
                }
                if (notificationSettings)
                {
                    NotificationHistory.find({personId: req.userID, typeNumber: {"$in": notificationSettings}},
                            function (err, notification) {
                                if (err) {
                                    console.error(err);
                                }
                                if (notification) {
                                    res.json(notification);
                                } else {
                                    return res.status(400).json({
                                        status: 404,
                                        message: "Get notification history failed: person may not exist."
                                    });
                                }
                            });
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
                message: "Get notification history failed: unauthorized or token expired."
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
                            if (notificationSetting)
                            {
                                res.sendStatus(200);
                            } else {
                                return res.status(403).json({
                                    status: 403,
                                    message: "Notification Settings not found, invalid personId"
                                });
                            }
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