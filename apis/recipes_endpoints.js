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
            }
			else {
				res.json(allRecipes);
			}
		});

	});

	// delete a recipe
    app.delete("/recipe/:recipeId", function (req, res) {
        if (req.auth) {
            // Admin can delete any recipe
            if (req.isAdmin) {
                Recipe.find({recipeId: parseInt(req.params.recipeId)}).remove().exec(function (err) {
                    if (err) 
                        return console.error(err);
                    return res.sendStatus(200);
                });
            } 
            else {
               // check if the user trying to delete is the owner of the recipe
               Recipe.find({recipeId: parseInt(req.params.recipeId)}, function (err, resultRecipe) {
                    if (err)
                        return console.error(err);
                    if (req.userID == resultRecipe.personId) {
                        resultRecipe.remove(function (err) {
                            if (err)
                                return console.error(err);
                            return res.sendStatus(200);
                        });
                    }
                });                
            }
                
       } 
        else { // user token expired
            return res.status(401).json({
                status: 401,
                message: "Remove a recipe failed: unauthorized or token expired."
            });
       }
    });

};