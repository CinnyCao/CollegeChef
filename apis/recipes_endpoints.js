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

    app.get("/recipe/:recipeId", function (req, res) {
        Recipe.aggregate(
            [
                // find specified recipe
                {"$match": {"_id": {"$eq": parseInt(req.params.recipeId)}}},
                // join to get user info
                {"$lookup": {
                    from: "users",
                    localField: "personId",
                    foreignField: "_id",
                    as: "uploader"
                }},
                // join to get modifier info
                {"$lookup": {
                    from: "users",
                    localField: "ModifiedById",
                    foreignField: "_id",
                    as: "modifier"
                }},
                // join to get category name
                {"$lookup": {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }},
                // join to get ingredients info
                {"$lookup": {
                    from: "ingredients",
                    localField: "recipeId",
                    foreignField: "recipeId",
                    as: "ingredients"
                }},
                // set return fields
                {"$project": {
                    "recipeName": 1,
                    "description": 1,
                    "instruction": 1,
                    "imgUrl": 1,
                    "numServings": 1,
                    "ModifiedDate": 1,
                    "uploader._id": 1,
                    "uploader.userName": 1,
                    "modifier.userName": 1,
                    "modifier._id": 1,
                    "category._id": 1,
                    "category.name": 1,
                    "ingredients._id": 1,
                    "ingredients.name": 1,
                    "ingredients.imgUrl": 1
                }}
            ], function (err, resultRecipes) {
                res.json(resultRecipes);
            }
        )
    });

};