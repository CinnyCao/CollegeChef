module.exports = function (app, sha1, getRandomIntInclusive, User, Ingredient, Category, Recipe, IngredientToRecipe) {
    console.log("Checking for factory data: 1. Users, 2. Ingredients, 3. Categories");

    // insert built-in admin and user
    var users = [
        {userName: 'admin', password: sha1("adminadmin"), isAdmin: true},
        {userName: 'user', password: sha1("useruser"), isAdmin: false}
    ];

    User.find({}, function (err, resUsers) {
        if (err)
            return console.error(err);
        // check if factory admin and user have been created or not
        if (!resUsers.length) {
            console.log("Inserting factory admin and user");
            User.create(users, function (err, createdUsers) {
                if (err)
                    return console.error(err);
                for (var i = 0; i < createdUsers.length; i++) {
                    createdUsers[i].introduce();
                }
                console.log("Factory admin and user OK");
            });
        } else {
            console.log("Factory admin and user OK");
        }
    });


    // insert built-in ingredients
    var ingredients = [
        {name: "cheese", imgUrl: "/img/ingredients/cheese.png"},
        {name: "egg", imgUrl: "/img/ingredients/egg.png"},
        {name: "eggplant", imgUrl: "/img/ingredients/eggplant.png"},
        {name: "milk", imgUrl: "/img/ingredients/milk_ing.ipg"},
        {name: "brown sugar", imgUrl: "/img/ingredients/brown_sugar_ing.jpg"},
        {name: "mushroom", imgUrl: "/img/ingredients/mushroom_ing.jpg"},
        {name: "butter", imgUrl: "/img/ingredients/butter.jpg"}
    ];

    Ingredient.find({}, function (err, allingredients) {
        if (err)
            return console.error(err);
        if (!allingredients.length) {
            console.log("Inserting factory ingredients");
            Ingredient.create(ingredients, function (err, createdIngredients) {
                if (err)
                    return console.error(err);
                for (var i = 0; i < createdIngredients.length; i++) {
                    createdIngredients[i].check();
                }
                console.log("Factory ingredients data OK");
            });
        } else {
            console.log("Factory ingredients data OK");
        }
    });

    // insert built-in categories
    var categories = [
        {name: "dinner"},
        {name: "dessert"},
        {name: "soup"}
    ];

    Category.find({}, function (err, allCategories) {
        if (err)
            return console.error(err);
        if (!allCategories.length) {
            console.log("Inserting factory categories");
            Category.create(categories, function (err, createdCategories) {
                if (err)
                    return console.error(err);
                for (var i = 0; i < createdCategories.length; i++) {
                    createdCategories[i].check();
                }
                console.log("Factory categories data OK");
            });
        } else {
            console.log("Factory categories data OK");
        }
    });

    // insert testing recipes
    Recipe.find({}, function (err, allRecipes) {
        if (err)
            return console.error(err);
        if (!allRecipes.length) {
            console.log("Inserting testing recipes");
            // insert 3 test recipes
            for (var i=0; i<3; i++) {
                var defaultRecipe = new Recipe({
                    personId: getRandomIntInclusive(0, 1), recipeName: "testRecipe" + i, categoryId: getRandomIntInclusive(0, 2), description: "Test test",
                    instruction: "Test test instruction", imgUrl: "/img/recipes/steak.jpg", numServings: 1
                });
                defaultRecipe.save(function (err, newRecipe) {
                    if (err) return console.error(err);
                    var numOfIngredients = getRandomIntInclusive(1, 4);
                    var addedIngredients = [];
                    for (var i = 0; i < numOfIngredients; i++) {
                        // need to insert non-duplicated ingredients
                        var ingredientId = getRandomIntInclusive(0, 6);
                        while (addedIngredients.length > 0 && addedIngredients.indexOf(ingredientId) != -1) {
                            ingredientId = getRandomIntInclusive(0, 6);
                        }
                        addedIngredients.push(ingredientId);
                        newRecipe.addIngredient(ingredientId, "1 portion");
                    }
                    console.log("Testing recipe #" + i + " inserted");
                });
            }
        } else {
            console.log("Testing recipe data OK");
        }
    });
};