module.exports = function (app, sha1, User, Ingredient) {
    // insert built-in admin
    var users = [
        {userName: 'admin', password: sha1("admin"), isAdmin: true},
        {userName: 'user', password: sha1("user"), isAdmin: false}
    ];

    User.find({}, function (err, adminUser) {
        if (err)
            return console.error(err);
        if (adminUser.length) {
            // for testing, test if amdin has been created
            adminUser[0].test();
        } else {
            User.create(users, function (err) {
                if (err)
                    return console.error(err);
            });
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
            Ingredient.create(ingredients, function (err) {
                if (err)
                    return console.error(err);
            });
        }
    });
};