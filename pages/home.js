$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');

    // onpen the first recipe list on start
    showRecipeList('hot_recipes');

    // load recipe_card
    $('#hot_recipes').load('/components/recipe_card.html');
});

function filterIngredients() {
    var search_text = $('#ingredient_search_input').val().toLowerCase();
    var ingredients = $(".ingredient_button");

    for (i = 0; i < ingredients.length; i++) {
        $(ingredients[i]).toggle(ingredients[i].title.toLowerCase().startsWith(search_text));
    }
}

function showRecipeList(id) {
    var list_container = $('#' + id).toggleClass('w3-show');
}
