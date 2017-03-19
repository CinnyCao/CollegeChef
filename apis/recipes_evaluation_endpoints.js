module.exports = function (app, Comment, Rate, Favorite) {

    // Get all comments of a recipe
    app.get("/recipe/:recipeId/comments", function (req, res) {
        Comment.find({recipeId: parseInt(req.params.recipeId)}, function (err, comments) {
            if (err) {
                console.error(err);
            }

            res.json(comments);
        });
    });

    // Comment a recipe
    app.post("/recipe/:recipeId/comments", function (req, res) {
        if (req.auth)
        {
            if (req.body.isImage && req.body.message)
            {
                var comment = new Comment({
                    recipeId: parseInt(req.params.recipeId),
                    personId: req.userID,
                    isImage: req.body.isImage,
                    message: req.body.message
                });
                comment.save(function (err) {
                    if (err)
                        return console.error(err);
                });
                comment.addCommentNotification(comment.recipeId, comment.personId);
                res.json({recipeId: parseInt(req.params.recipeId)});
            } else
            {
                return res.status(400).json({
                    status: 400,
                    message: "Comment in a recipe failed: missing required input."
                });
            }
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Comment in a recipe failed: unauthorized or token expired."
            });
        }
    });

    // get the rate of a recipe
    app.get("/recipe/:recipeId/rate", function (req, res) {
        if (req.auth)
        {
            Rate.findOne({recipeId: parseInt(req.params.recipeId), personId: req.userID},
                    '-_id scores',
                    function (err, comments) {
                        if (err) {
                            console.error(err);
                        }
                        if (comments)
                        {
                            res.json(comments);
                        } else
                        {
                            outPutRateAvg(parseInt(req.params.recipeId), res);
                        }
                    });
        } else {
            outPutRateAvg(parseInt(req.params.recipeId), res);
        }
    });

    // get average rate of a specific recipe
    var outPutRateAvg = function (recipeId, res) {
        Rate.aggregate(
                [
                    // group by recipe id and calculate average scores
                    {"$group": {
                            "_id": "$recipeId",
                            "scores": {"$avg": "$scores"},
                            "recipeId": {"$push": "$recipeId"}
                        }},
                    {"$match": {"recipeId": {"$eq": recipeId}}},
                    // set return fields
                    {"$project": {
                            "_id": 0,
                            "scores": 1
                        }}
                ], function (err, rateAvg) {
            if (rateAvg.length)
            {
                res.json(rateAvg[0]);

            } else {
                res.json({"scores": 0});
            }
        }
        );
    };

    // rate a recipe
    app.post("/recipe/:recipeId/rate", function (req, res) {
        if (req.auth)
        {
            if (req.body.scores)
            {
                var rate = new Rate({
                    recipeId: parseInt(req.params.recipeId),
                    personId: req.userID,
                    scores: req.body.scores
                });
                rate.save(function (err) {
                    if (err)
                        return console.error(err);
                });
                rate.addRateNotification(rate.recipeId, rate.personId);
                res.json(rate);
            } else
            {
                return res.status(400).json({
                    status: 400,
                    message: "Rate a recipe failed: missing required input."
                });
            }
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Rate a recipe failed: unauthorized or token expired."
            });
        }
    });

    // favorite a recipe
    app.post("/recipe/:recipeId/favorite", function (req, res) {
        if (req.auth)
        {
            var favorite = new Favorite({
                recipeId: parseInt(req.params.recipeId),
                personId: req.userID
            });
            favorite.save(function (err) {
                if (err)
                    return console.error(err);
            });
            favorite.addFavoriteNotification(favorite.recipeId, favorite.personId);
            res.json({recipeId: parseInt(req.params.recipeId)});
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Favorite a recipe failed: unauthorized or token expired."
            });
        }
    });

    // unfavorite recipe
    app.delete("/recipe/:recipeId/favorite", function (req, res) {
        if (req.auth)
        {
            Favorite.find({recipeId: parseInt(req.params.recipeId), personId: req.userID}).remove().exec(function (err) {
                if (err)
                    return console.error(err);
                return res.sendStatus(200);
            });
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Remove a favorite recipe failed: unauthorized or token expired."
            });
        }
    });
};


