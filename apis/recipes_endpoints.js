module.exports = function (app, Recipe, Ingredient) {
	// get all recipes
	app.get('/recipes', function (req, res){
		Recipe.find({}, '_id recipeName description imgUrl', function (err, allRecipes) {
			if (err) {
				console.error(err);
			}
			if (!allRecipes.length) {
				return res.status(403).json({
					status: 403,
					message: "Get recipes failed: no ingredients found in database"
				});
				else {
					res.json(allRecipes);
				}
			}
		});

	});

};