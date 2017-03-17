module.exports = function (app, Comment) {

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
};