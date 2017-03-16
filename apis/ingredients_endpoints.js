module.exports = function (app, Recipe, Ingredient) {
    
    // get all ingredients
    app.get('/ingredients', function (req, res) {
        Ingredient.find({}, '_id name imgUrl', function (err, allIngredients) {
            if (err) {
                console.error(err);
            }
            if (!allIngredients.length) {
                return res.sendStatus(403);
            } else {
                res.json(allIngredients);
            }
        });
    });
};