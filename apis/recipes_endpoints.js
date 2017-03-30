module.exports = function (app, isDefined, Recipe, IngredientToRecipe) {
    // get all recipes
    app.get('/recipes', function (req, res) {
        Recipe.find({isDeleted: false}, '_id recipeName description imgUrl', function (err, allRecipes) {
            if (err) {
                return console.error(err);
            }
            res.json(allRecipes);
        });
    });

    var getRecipeDetail = function (req, res, recipeId) {
        Recipe.aggregate(
            [
                // find specified recipe
                {"$match": {"_id": {"$eq": recipeId}}},
                // join to get user info
                {"$lookup": {
                    from: "users",
                    localField: "personId",
                    foreignField: "_id",
                    as: "uploader"
                }},
                {$unwind: "$uploader"},
                // join to get modifier info
                {"$lookup": {
                    from: "users",
                    localField: "ModifiedById",
                    foreignField: "_id",
                    as: "modifier"
                }},
                {$unwind: "$modifier"},
                // join to get category name
                {"$lookup": {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }},
                {$unwind: "$category"},
                // join to get ingredients info
                {"$lookup": {
                    from: "ingredienttorecipes",
                    localField: "_id",
                    foreignField: "recipeId",
                    as: "ingredients"
                }},
                // set return fields
                {"$project": {
                    "_id": 0,
                    "recipeId": "$_id",
                    "recipeName": 1,
                    "description": 1,
                    "instruction": 1,
                    "imgUrl": 1,
                    "numServings": 1,
                    "ModifiedDate": 1,
                    "uploaderId": "$uploader._id",
                    "uploaderName": "$uploader.userName",
                    "modifierId": "$modifier._id",
                    "modifierName": "$modifier.userName",
                    "categoryId": "$category._id",
                    "categoryName": "$category.name",
                    "ingredients.ingredientId": 1,
                    "ingredients.amount": 1
                }}
            ], function (err, resultRecipes) {
                if (err) {
                    return console.error(err);
                }
                if (resultRecipes.length) {
                    return res.json(resultRecipes[0]);
                } else {
                    return res.status(404).json({
                        status: 404,
                        message: "GET RECIPE FAILURE: Bad Request (recipe not found)"
                    });
                }
            }
        )
    };

    // add a recipe
    app.post("/recipe", function (req, res) {
        if (req.auth) {
            if (req.body.recipeName && req.body.categoryId && req.body.description && req.body.instruction
                && req.body.imgUrl && req.body.numServings && req.body.ingredients) {
                var recipeData = {};
                recipeData["recipeName"] = req.body.recipeName;
                recipeData["categoryId"] = req.body.categoryId;
                recipeData["description"] = req.body.description;
                recipeData["instruction"] = req.body.instruction;
                recipeData["imgUrl"] = req.body.imgUrl;
                recipeData["numServings"] = req.body.numServings;
                if (req.body.notes) {
                    recipeData["notes"] = req.body.notes;
                }
                var recipe = new Recipe(recipeData);
                recipe.save(function (err, newRecipe) {
                    if (err) {
                        return console.error(err);
                    }
                    // link with ingredients
                    var ingredientData = [];
                    for (var i=0; i<req.body.ingredients.length; i++) {
                        var data = {};
                        data["ingredientId"] = req.body.ingredients[i].id;
                        data["recipeId"] = newRecipe._id;
                        data["amount"] = req.body.ingredients[i].amount;
                        ingredientData.push(data);
                    }

                    IngredientToRecipe.create(ingredientData, function (err, created) {
                        if (err) {
                            return console.error(err);
                        }
                        getRecipeDetail(req, res, newRecipe._id);
                    });
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "CREATE RECIPE FAILURE: Bad Request (missing required fields)"
                });
            }
        } else {
            return res.status(401).json({
                status: 401,
                message: "UPDATE RECIPE FAILURE: Unauthorized (missing token or token expired)"
            });
        }
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
                    resultRecipe.update({isDeleted: true}, function (err) {
                        if (err)
                            return console.error(err);
                        return res.status(200).json({});
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
            if (req.body.categoryId) {
                toUpdate["categoryId"] = req.body.categoryId;
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
            if (Object.keys(toUpdate).length < 1 && !req.body.ingredients) {
                return res.status(400).json({
                    status: 400,
                    message: "UPDATE RECIPE FAILURE: Bad Request (no modifiable field passed)"
                });
            } else {
                toUpdate["ModifiedById"] = req.userID;
                toUpdate["ModifiedDate"] = Date.now();
                Recipe.findOneAndUpdate({'_id': parseInt(req.params.recipeId), isDeleted: false},  toUpdate, {new : true}, function (err, updatedRecipe) {
                    if (err) {
                        return console.error(err);
                    }
                    if (updatedRecipe) {
                        if (req.body.ingredients) {
                            IngredientToRecipe.remove({recipeId: parseInt(req.params.recipeId)}, function (err) {
                                var ingredientData = [];
                                for (var i=0; i<req.body.ingredients.length; i++) {
                                    var data = {};
                                    data["ingredientId"] = req.body.ingredients[i].id;
                                    data["recipeId"] = parseInt(req.params.recipeId);
                                    data["amount"] = req.body.ingredients[i].amount;
                                    ingredientData.push(data);
                                }
                                IngredientToRecipe.create(ingredientData, function (err, created) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    getRecipeDetail(req, res, parseInt(req.params.recipeId));
                                });
                            });
                        } else {
                            getRecipeDetail(req, res, parseInt(req.params.recipeId));
                        }
                    } else {
                        return res.status(404).json({
                            status: 404,
                            message: "UPDATE RECIPE FAILURE: Bad Request (recipe to update not found)"
                        });
                    }
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
        getRecipeDetail(req, res, parseInt(req.params.recipeId));
    });

};