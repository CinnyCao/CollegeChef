module.exports = function (app, sha1, User, Ingredient) {
    console.log("Checking for factory data: 1. Users, 2. Ingredients");

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
};