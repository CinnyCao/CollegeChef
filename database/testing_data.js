module.exports = function (app, getRandomIntInclusive, Recipe, Rate, Favorite, Comment) {
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
            for (var i = 0; i < 10; i++) {
                var defaultRecipe = new Recipe({
                    personId: getRandomIntInclusive(0, factoryRecordNum["numOfUsers"] - 1), recipeName: "testRecipe" + i,
                    categoryId: getRandomIntInclusive(0, factoryRecordNum["numOfCategories"] - 1), description: "Test test",
                    instruction: "Test test instruction", imgUrl: "/img/recipes/steak.jpg", numServings: 1
                });

                defaultRecipe.save(function (err, newRecipe) {
                    if (err)
                        return console.error(err);
                    // link with ingredients
                    var numOfIngredients = getRandomIntInclusive(1, 3);
                    var addedIngredients = [];
                    for (var j = 0; j < numOfIngredients; j++) {
                        // need to insert non-duplicated ingredients
                        var ingredientId = getRandomIntInclusive(0, factoryRecordNum["numOfIngredients"] - 1);
                        while (addedIngredients.length > 0 && addedIngredients.indexOf(ingredientId) != -1) {
                            ingredientId = getRandomIntInclusive(0, factoryRecordNum["numOfIngredients"] - 1);
                        }
                        addedIngredients.push(ingredientId);
                        newRecipe.addIngredient(ingredientId, "1 portion");
                    }

                    if (newRecipe._id > 0)
                    {
                        // let every factory user randomly rate current recipe
                        for (var u = 0; u < factoryRecordNum["numOfUsers"] - 1; u++) {
                            var score = getRandomIntInclusive(1, 5);
                            var rate = new Rate({
                                recipeId: newRecipe._id,
                                personId: u,
                                scores: score
                            });
                            rate.save(function (err, newRate) {
                                if (err)
                                    return console.error(err);
                                newRate.addRateNotification(newRecipe.personId, newRate.personId);
                            });
                        }

                        // randomly favorite recipes
                        for (var p = 0; p < factoryRecordNum["numOfUsers"]; p++) {
                            // for each user, randomly decide to favorite or not
                            var favoriteOrNot = getRandomIntInclusive(0, 10);
                            if (favoriteOrNot > 4) {
                                var favorite = new Favorite({
                                    recipeId: newRecipe._id,
                                    personId: p
                                });
                                favorite.save(function (err, newFavorite) {
                                    if (err)
                                        return console.error(err);
                                    newFavorite.addFavoriteNotification(newRecipe.personId, newFavorite.personId);
                                });
                            }
                        }

                        // randomly comment a recipe
                        for (var c = 0; c < getRandomIntInclusive(0, 10); c++) {
                            var isImage = getRandomIntInclusive(0, 1);
                            var message = "good good";
                            if (isImage) {
                                message = "/img/recipes/steak.jpg";
                            }
                            var comment = new Comment({
                                recipeId: newRecipe._id,
                                personId: getRandomIntInclusive(0, factoryRecordNum["numOfUsers"] - 1),
                                isImage: isImage,
                                message: message
                            });
                            comment.save(function (err, newComment) {
                                if (err)
                                    return console.error(err);
                                newComment.addCommentNotification(newRecipe.personId, newComment.personId);
                            });
                        }
                    }
                    else if(newRecipe._id == 9)
                    {
                        // rate current recipe
                        var rate = new Rate({
                            recipeId: newRecipe._id,
                            personId: 1,
                            scores: 1
                        });
                        rate.save(function (err, newRate) {
                            if (err)
                                return console.error(err);
                            newRate.addRateNotification(newRecipe.personId, newRate.personId);
                        });

                        // favorite current recipe
                        var favorite = new Favorite({
                            recipeId: newRecipe._id,
                            personId: 1
                        });
                        favorite.save(function (err, newFavorite) {
                            if (err)
                                return console.error(err);
                            newFavorite.addFavoriteNotification(newRecipe.personId, newFavorite.personId);
                        });

                        //comment current recipe
                        var comment = new Comment({
                            recipeId: newRecipe._id,
                            personId: 1,
                            isImage: false,
                            message: "test message"
                        });
                        comment.save(function (err, newComment) {
                            if (err)
                                return console.error(err);
                            newComment.addCommentNotification(newRecipe.personId, newComment.personId);
                        });
                    }

                    console.log("Recipe #" + newRecipe._id + " inserted");
                });
            }
        } else {
            console.log("Testing recipe data OK");
        }
    });
};