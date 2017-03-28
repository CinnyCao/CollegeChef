$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
    });

    // populate ingredients list
    populateIngredients(function () {
        // pin and unpin ingredient buttons
        $('.ingredient_button').on('click', function () {
            $(this).toggleClass('selected_ingredient_button');
            $(this).parent().prepend($('.selected_ingredient_button'));
        });
    });

    // open the first recipe list on start
    showRecipeList('hot_recipes');

    // load recipe_card
    populateRecipeCards();
    ellipsisRecipeCardDescription();
});

function populateIngredients(callback) {
    $.ajax({
        type : "GET",
        url : "/ingredients",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            for (var i = 0; i < response.length; i++) {
                $(".ingredient_buttons_wrapper").append($(getIngredientButton(response[i]["name"], response[i]["imgUrl"])));
            }
            callback();
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function populateRecipeCards() {
    var data = recipesData; // todo: load recipes list data from database
    for (var i = 0; i < data.length; i++) {
        $("#hot_recipes").append($(getRecipeCard(data[i][0], data[i][1], data[i][2])));
    }
    // todo: populate remarkable recipes and new recipes
}

function showRecipeList(id) {
    var list_container = $('#' + id).toggleClass('w3-show');
}