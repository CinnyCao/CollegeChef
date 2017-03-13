module.exports = function (app, Recipe, Ingredient) {
    
    // get all ingredients
    app.get('/ingredients', function (req, res) {
        Ingredient.find({}, function (err, allIngredients) {
            if (err) {
                console.error(err);
            } else {

            }

        });
    });
};