$(function() {
    //load navbar
    $('#navbar_holder').load('../components/navbar.html');
});

function filterIngredients() {
    var search_text = $('#ingredient_search_input').val().toLowerCase();
    var ingredients = $(".ingredient_button");

    for (i = 0; i < ingredients.length; i++) {
        $(ingredients[i]).toggle(ingredients[i].title.toLowerCase().startsWith(search_text));
    }
}