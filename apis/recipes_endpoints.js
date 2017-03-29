module.exports = function (app, Recipe, Ingredient) {
    // get all recipes
    app.get('/recipes', function (req, res) {
        Recipe.find({}, '_id recipeName description imgUrl', function (err, allRecipes) {
            if (err) {
                console.error(err);
            }
            res.json(allRecipes);
        });
    });

    // add a recipe
    app.post("/recipe", function (req, res) {

    });

    // delete a recipe
    app.delete("/recipe/:recipeId", function (req, res) {
        if (req.auth) {
            // find the recipe to be deleted
            Recipe.findOne({_id: parseInt(req.params.recipeId)}, function (err, resultRecipe) {
                if (err)
                    return console.error(err);
                // check if current user if the owner of the recipe; if not, no permission to delete
                // Admin can delete andy recipe
                if (req.isAdmin || req.userID == resultRecipe.personId) {
                    resultRecipe.remove(function (err) {
                        if (err)
                            return console.error(err);
                        return res.sendStatus(200);
                    });
                } else {
                    return res.status(403).json({
                        status: 403,
                        message: "DELETE RECIPE FAILURE: Forbidden (only Admin or recipe owner can delete this recipe)"
                    });
                }
            });
        } else {
            return res.status(401).json({
                status: 401,
                message: "DELETE RECIPE FAILURE: Unauthorized (missing token or token expired)"
            });
        }
    });

    app.put("/recipe/:recipeId", function (req, res) {
        if (req.auth) {
            var toUpdate = {};
            if (req.body.recipeName) {
                toUpdate["recipeName"] = req.body.recipeName;
            }
            if (req.body.description) {
                toUpdate["description"] = req.body.description;
            }
            if (req.body.instruction) {
                toUpdate["instruction"] = req.body.instruction;
            }
            if (req.body.imgUrl) {
                toUpdate["imgUrl"] = req.body.imgUrl;
            }
            if (req.body.numServings) {
                toUpdate["numServings"] = req.body.numServings;
            }
            if (req.body.notes) {
                toUpdate["notes"] = req.body.notes;
            }
            if (Object.keys(toUpdate).length > 0) {
                toUpdate["ModifiedById"] = req.userID;
                toUpdate["ModifiedDate"] = Date.now();
                Recipe.findOneAndUpdate({'_id': req.params.recipeId}, toUpdate, {new : true}, function (err, updatedRecipe) {
                    if (err) {
                        console.error(err);
                    }
                    res.sendStatus(200);
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "UPDATE RECIPE FAILURE: Bad Request (no modifiable field passed)"
                });
            }
        } else {
            return res.status(401).json({
                status: 401,
                message: "UPDATE RECIPE FAILURE: Unauthorized (missing token or token expired)"
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