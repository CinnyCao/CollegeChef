module.exports = function (app, Recipe, Ingredient) {
    
    // get all ingredients
    app.get('/ingredients', function (req, res) {
        Ingredient.find({}, '_id name imgUrl').sort({name: 1}).exec(function (err, allIngredients) {
            if (err) {
                console.error(err);
            }
            if (!allIngredients.length) {
                return res.status(403).json({
                    status: 403,
                    message: "Get ingredients failed: no ingredients found in database"
                });
            } else {
                res.json(allIngredients);
            }
        });
    });
};