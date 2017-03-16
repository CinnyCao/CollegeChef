module.exports = function (app, getRandomIntInclusive, Recipe) {
    var factoryRecordNum = {
        "numOfUsers": 2,
        "numOfIngredients": 7,
        "numOfCategories": 3
    };

    // insert testing recipes
    Recipe.find({}, function (err, allRecipes) {
        if (err)
            return console.error(err);
        if (!allRecipes.length) {
            console.log("Inserting testing recipes");
            // insert 10 test recipes
            for (var i=0; i<10; i++) {
                var defaultRecipe = new Recipe({
                    personId: getRandomIntInclusive(0, factoryRecordNum["numOfUsers"]-1), recipeName: "testRecipe" + i,
                    categoryId: getRandomIntInclusive(0, factoryRecordNum["numOfCategories"]-1), description: "Test test",
                    instruction: "Test test instruction", imgUrl: "/img/recipes/steak.jpg", numServings: 1
                });
                defaultRecipe.save(function (err, newRecipe) {
                    if (err) return console.error(err);
                    var numOfIngredients = getRandomIntInclusive(1, 3);
                    var addedIngredients = [];
                    for (var j = 0; j < numOfIngredients; j++) {
                        // need to insert non-duplicated ingredients
                        var ingredientId = getRandomIntInclusive(0, factoryRecordNum["numOfIngredients"]-1);
                        while (addedIngredients.length > 0 && addedIngredients.indexOf(ingredientId) != -1) {
                            ingredientId = getRandomIntInclusive(0, factoryRecordNum["numOfIngredients"]-1);
                        }
                        addedIngredients.push(ingredientId);
                        newRecipe.addIngredient(ingredientId, "1 portion");
                    }
                    console.log("Recipe #" + newRecipe._id + " inserted");
                });
            }
        } else {
            console.log("Testing recipe data OK");
        }
    });
};