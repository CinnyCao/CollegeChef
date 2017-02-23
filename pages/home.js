/** dummy data **/
var ingredients = [
    ["Egg", "/img/egg.png"],
    ["Cheese", "/img/cheese.png"],
    ["Eggplant", "/img/eggplant.png"],
    ["Apple", "/img/icon.png"],
    ["Pineapple", "/img/icon.png"],
    ["Chicken", "/img/icon.png"]
];

$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');

    // populate ingredients list
    populateIngredients();

    // open the first recipe list on start
    showRecipeList('hot_recipes');

    // load recipe_card
    $('.hot_recipes').load('/components/recipe_card.html');

    // pin and unpin ingredient buttons
    $('.ingredient_button').on('click', function () {
        $(this).toggleClass('selected_ingredient_button');
        $(this).parent().prepend($('.selected_ingredient_button'));
    });
});

function populateIngredients() {
    var data = ingredients; // todo: load ingredients data from database
    for (var i = 0; i < ingredients.length; i++) {
        $(".ingredient_buttons_wrapper").append($(getIngredientButton(data[i][0], data[i][1])));
    }
}

function showRecipeList(id) {
    var list_container = $('#' + id).toggleClass('w3-show');
}