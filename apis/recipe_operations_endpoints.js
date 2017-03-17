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
                    recipeId: req.params.recipeId,
                    personId: req.userID,
                    isImage: req.body.isImage,
                    message: req.body.message
                });
                comment.save(function (err) {
                    if (err)
                        return console.error(err);
                });
                comment.addCommentNotification(comment.recipeId, comment.personId);
                res.json(comment);
            }
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Comment a recipe failed: unauthorized or token expired."
            });
        }
    });

    // get the rate of a recipe
    app.get("/recipe/:recipeId/rate", function (req, res) {
        Rate.find({recipeId: parseInt(req.params.recipeId)}, function (err, rate) {
            if (err) {
                console.error(err);
            }

            res.json(rate);
        });
    });

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
            }
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Comment a recipe failed: unauthorized or token expired."
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
            res.json(favorite);
        } else
        {
            return res.status(401).json({
                status: 401,
                message: "Comment a recipe failed: unauthorized or token expired."
            });
        }
    });
};