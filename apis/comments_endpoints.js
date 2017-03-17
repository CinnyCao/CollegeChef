module.exports = function (app, Comment) {

    // Get all comments of a recipe
    app.get("/recipeId/:recipeId/comments", function (req, res) {
        Comment.find({recipeId: parseInt(req.params.recipeId)}, function (err, comments) {
            if (err) {
                console.error(err);
            }

            res.json(comments);
        });
    });
};