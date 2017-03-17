module.exports = function (app, Recipe, IngredientToRecipe, Ingredient, Rate, Favorite, Comment) {

    // search recipes by ingredients
    app.post('/search', function (req, res) {
        if (!req.body.ingredients) {
            return res.status(400).json({
                status: 400,
                message: "Search failed: Missing ingredients id list in request"
            });
        }
        var numOfIngredients = req.body.ingredients.length;
        IngredientToRecipe.aggregate(
            [
                // group by recipe id
                {"$group": {
                    "_id": "$recipeId",
                    "ingredientCount": {"$sum": 1},
                    "ingredients": {"$push": {"ingredientId": "$ingredientId", "amount": "$amount"}},
                    "ingredientIdSet": {"$push": "$ingredientId"}
                }},
                // find records with correct ingredient count
                {"$match": {"ingredientCount": {"$eq": numOfIngredients}}},
                // check if all ingredients required is present
                {"$project": {
                    "ingredientCount": 1,
                    "ingredients": 1,
                    "correct": {"$setIsSubset": ["$ingredientIdSet", req.body.ingredients]}
                }},
                {"$match": {"correct": {"$eq": true}}},
                // join recipe details by id
                {"$lookup": {
                    from: "recipes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "recipes"
                }},
                // return only an array of result recipes with wanted fields
                {"$project": {
                    "_id": 0,
//                    "ingredientCount": 1,
                    "ingredients": 1,
                    "recipes._id": 1,
                    "recipes.recipeName": 1,
                    "recipes.description": 1,
                    "recipes.imgUrl": 1
                }}
            ], function (err, resultRecipes) {
                res.json(resultRecipes);
            }
        )
    });

    // get hot (mostly commented) recipes
    app.get("/recipes/hot", function (req, res) {
        Comment.aggregate(
            [
                // group by recipe id and count num of comments
                {"$group": {
                    "_id": "$recipeId",
                    "commentCount": {"$sum": 1}
                }},
                // sort by commentCount
                {"$sort": {"commentCount": -1}},
                // get only first 10
                {"$limit" : 10 },
                // join recipe details by id
                {"$lookup": {
                    from: "recipes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "recipes"
                }},
                // set return fields
                {"$project": {
                        "_id": 0,
                        "commentCount": 1,
                        "recipes._id": 1,
                        "recipes.recipeName": 1,
                        "recipes.description": 1,
                        "recipes.imgUrl": 1
                }}
            ], function (err, resultRecipes) {
                res.json(resultRecipes);
            }
        )
    });
    
    // get remarkable (highest rated) recipes
    app.get("/recipes/remarkable", function (req, res) {
        Rate.aggregate(
            [
                // group by recipe id and calculate average scores
                {"$group": {
                    "_id": "$recipeId",
                    "avgScore": {"$avg": "$scores"}
                }},
                // sort by avgScore
                {"$sort": {"avgScore": -1}},
                // get only first 10
                {"$limit" : 10 },
                // join recipe details by id
                {"$lookup": {
                    from: "recipes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "recipes"
                }},
                // set return fields
                {"$project": {
                        "_id": 0,
                        "avgScore": 1,
                        "recipes._id": 1,
                        "recipes.recipeName": 1,
                        "recipes.description": 1,
                        "recipes.imgUrl": 1
                }}
            ], function (err, resultRecipes) {
                res.json(resultRecipes);
            }
        )
    });
    
    // get new recipes
    app.get("/recipes/new", function (req, res) {
        Recipe.aggregate(
            [
                // sort by ModifiedDate
                {"$sort": {"ModifiedDate": -1}},
                // get only first 10
                {"$limit" : 10 },
                // set return fields
                {"$project": {
                        "ModifiedDate": 1,
                        "recipeName": 1,
                        "description": 1,
                        "imgUrl": 1
                }}
            ], function (err, resultRecipes) {
                res.json(resultRecipes);
            }
        )
    });
    
    // get favorited recipes
    
    // get recipes uploaded by specified user
    app.post("/recipes/uploaded", function (req, res) {
        if (req.auth) {
            // default to get current user's uploaded recipes if userName not specified
            var specifiedUser = req.userName;
            if (req.body.userName) {
                specifiedUser = req.body.userName;
            }
            Recipe.aggregate(
                [
                    // join with user table
                    {"$lookup": {
                        from: "users",
                        localField: "personId",
                        foreignField: "_id",
                        as: "user"
                    }},
                    // find recipes uploaded by user with userName specifiedUser
                    {"$match": {"user.userName": {"$eq": specifiedUser}}},
                    // set return fields
                    {"$project": {
                            "recipeName": 1,
                            "description": 1,
                            "imgUrl": 1
                    }}
                ], function (err, resultRecipes) {
                    res.json(resultRecipes);
                }
            )
        } else if (!req.auth) {
            return res.status(401).json({
                status: 401,
                message: "Get Uploaded Recipes failed: user deleted or token expired"
            });
        } else {
            return res.status(401).json({
                status: 401,
                message: "Get Uploaded Recipes failed: unauthorized"
            });
        }
    });

};