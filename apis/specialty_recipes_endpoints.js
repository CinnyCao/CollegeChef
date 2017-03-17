module.exports = function (app, Recipe, IngredientToRecipe, Ingredient, Rate, Favorite) {

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
//                    "ingredients": 1,
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

    });
    
    // get remarkable (highest rated) recipes
    
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
//                        "ModifiedDate": 1,
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
    
    // get recipes uploaded by current user
    

};