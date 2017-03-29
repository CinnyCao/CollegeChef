module.exports = function (app, ActionHistory) {

    // get notification history
    app.get("/notification", function (req, res) {
        if (req.auth)
        {
            // check if input query are valid
            var validQueryKeys = {
                "recipetype": ["uploaded", "favorite"],
                "actiontype": ["rate", "comment", "favorite", "update", "delete"]
            };
            for (var key in req.query) {
                if (validQueryKeys.indexOf(key) < 0) {
                    return res.status(400).json({
                        error: 400,
                        message: "GET NOTIFICATION FAILURE: Bad Request (Only recipetype and/or actiontype are accepted in query"
                    })
                }
            }
            ActionHistory.findOne({'personId': req.userID}, function (err, history) {
                if (err) {
                    console.error(err);
                }
                if (history)
                {
                    ActionHistory.find({personId: req.userID, typeNumber: {"$in": history}},
                            function (err, history) {
                                if (err) {
                                    console.error(err);
                                }
                                res.json(history);
                            });
                } else {
                    return res.status(400).json({
                        status: 404,
                        message: "Get notification settings failed: missing required input."
                    });
                }
            });
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Get notification history failed: unauthorized or token expired."
            });
        }
    });
};