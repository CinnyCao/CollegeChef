/** dummy data **/
var ingredients = [
    ["Egg", "/img/ingredients/egg.png"],
    ["Cheese", "/img/ingredients/cheese.png"],
    ["Eggplant", "/img/ingredients/eggplant.png"],
    ["Brown Sugar", "/img/ingredients/brown_sugar_ing.jpg"],
    ["Milk", "/img/ingredients/milk_ing.jpg"],
    ["Mushroom", "/img/ingredients/mushroom_ing.jpg"]
];

var hot_recipes = [
    ["Meat Loaf",
        "This recipe is anything but regular old meatloaf! Everyone will love this moist version made in the slow cooker, with milk, mushrooms, and a little sage for extra flavor.",
        "/img/recipes/meatloaf.jpg"],
    ["Scrambled Eggs",
        "This is the description",
        "/img/recipes/scrambledeggs.jpg"],
    ["Ramen",
        "This is the description",
        "/img/recipes/ramen.jpg"],
    ["Chicken Nuggets",
        "This is the description",
        "/img/recipes/chickennuggets.jpg"],
    ["Steak",
        "This is the description",
        "/img/recipes/steak.JPG"],
    ["BLT Sandwhich",
        "This is the description",
        "/img/recipes/bltsandwich.jpg"],
    ["Pizza",
        "This is the description",
        "/img/recipes/pizza.jpg"]
];

$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
    });

    // populate ingredients list
    populateIngredients();

    // open the first recipe list on start
    showRecipeList('hot_recipes');

    // load recipe_card
    populateRecipeCards();
    ellipsisRecipeCardDescription();

    // pin and unpin ingredient buttons
    $('.ingredient_button').on('click', function () {
        $(this).toggleClass('selected_ingredient_button');
        $(this).parent().prepend($('.selected_ingredient_button'));
    });
});

function populateIngredients() {
    var data = ingredients; // todo: load ingredients data from database
    for (var i = 0; i < data.length; i++) {
        $(".ingredient_buttons_wrapper").append($(getIngredientButton(data[i][0], data[i][1])));
    }
}

function populateRecipeCards() {
    var data = hot_recipes; // todo: load recipes list data from database
    for (var i = 0; i < data.length; i++) {
        $("#hot_recipes").append($(getRecipeCard(data[i][0], data[i][1], data[i][2])));
    }
    // todo: populate remarkable recipes and new recipes
}

function showRecipeList(id) {
    var list_container = $('#' + id).toggleClass('w3-show');
}