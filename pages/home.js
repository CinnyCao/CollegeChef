$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');
    //load footer
    $('#footer_holder').load('/components/footer.html');

    // make ingredient search bar wider on medium screen
    changeColumnPercentage();
    $(window).on('resize', function () {
        changeColumnPercentage();
    });
});

function changeColumnPercentage() {
    if ($(window).width() <= 992 && $(window).width() >= 601) {
        $('#left_col').removeClass('w3-quarter');
        $('#right_col').removeClass('w3-threequarter');
        $('#left_col').addClass('w3-third');
        $('#right_col').addClass('w3-twothird');
    } else {
        $('#left_col').removeClass('w3-third');
        $('#right_col').removeClass('w3-twothird');
        $('#left_col').addClass('w3-quarter');
        $('#right_col').addClass('w3-threequarter');
    }
}

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