$(function() {
    //load footer
    $('#footer_holder').load('/components/footer.html');

    $(window).on('resize', function () {
        // make left side bar wider on medium screen
        changeColumnPercentage();
        
        // change main content height
        var paddingTotal = parseInt($('body').css('padding-top')) + parseInt($('body').css('padding-bottom'));
        if (paddingTotal == 0) {
            paddingTotal = 110;
        }
        $('.section_card').innerHeight($(window).height() - paddingTotal - 3);
    }).trigger('resize');
});

function changeColumnPercentage() {
    if ($(window).width() <= 992 && $(window).width() >= 601) {
        $('.left_col').removeClass('w3-quarter');
        $('.right_col').removeClass('w3-threequarter');
        $('.left_col').addClass('w3-third');
        $('.right_col').addClass('w3-twothird');
    } else {
        $('.left_col').removeClass('w3-third');
        $('.right_col').removeClass('w3-twothird');
        $('.left_col').addClass('w3-quarter');
        $('.right_col').addClass('w3-threequarter');
    }
}

function hide(id){
    $('#' + id).hide();
}

function show(id){
    $('#' + id).show();
}

/**
 * Ingredient Button
 **/

function getIngredientButton(title, src) {
    title = title.substr(0, 1).toUpperCase() + title.substr(1, title.length - 1).toLowerCase();
    return '' +
        '<a class="ingredient_button w3-center" href="#" title="' + title + '">' +
            '<img src="' + src + '" alt="' + title + '"><p>' + title + '</p>' +
        '</a>';
}

function filterIngredients() {
    var search_text = $('#ingredient_search_input').val().toLowerCase();
    var ingredients = $(".ingredient_button:not(.selected_ingredient_button)");

    for (i = 0; i < ingredients.length; i++) {
        $(ingredients[i]).toggle(ingredients[i].title.toLowerCase().indexOf(search_text) >= 0);
    }
}