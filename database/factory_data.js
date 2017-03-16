module.exports = function (app, sha1, User, Ingredient, Category, Recipe) {
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

    // insert demo recipe
    Ingredient.find({'name': {$in: ["cheese", "egg", "milk"]}}).distinct('_id', function (err, ingredientIds) {
        User.find().distinct('_id', function (err1, personIds) {
            if (err1)
                return console.error(err1);
            Category.find().distinct('_id', function (err2, categoryIds) {
                if (err2)
                    return console.error(err2);
//                var recipeDemo = new Recipe({
//                    personId: personIds[0],
//                    recipeName: "demoRecipe",
//                    ingredientIds: ingredientIds,
//                    categoryId: categoryIds[0],
//                    description: "declicious, very delicious, very very delicious",
//                    instruction: "1. use egg, 2. use milk, 3. use cheese",
//                    imgUrl: "/img/recipes/ramen.jpg",
//                    numServings: 3
//                });
//                // create new demo recipe
//                recipeDemo.save(function (err) {
//                    if (err)
//                        return console.error(err);
//                });
var recipeDemo = [{                   personId: personIds[0],
                    recipeName: "demoRecipe",
                    ingredientIds: ingredientIds,
                    categoryId: categoryIds[0],
                    description: "declicious, very delicious, very very delicious",
                    instruction: "1. use egg, 2. use milk, 3. use cheese",
                    imgUrl: "/img/recipes/ramen.jpg",
                    numServings: 3}];
            Recipe.create(recipeDemo, function(err, ls)
            {
                                if (err)
                    return console.error(err);
            });
            });
        });
    });
};