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
    $(".user_only_recipe_list").toggle(getUserType() !== null);

    // load recipe_card
    populateRecipeCards();

    $(window).on("loggedin", function () {
        populateUserOnlyRecipeList();
        $(".user_only_recipe_list").toggle(getUserType() !== null);
    });
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
    $.ajax({
        type : "GET",
        url : "/recipes/hot",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            for (var i = 0; i < response.length; i++) {
                $("#hot_recipes").append(
                    $(getRecipeCard(response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"],
                    RECIPE_CARD_COMMENT_COUNT_TOOL, response[i]["commentCount"])));
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });

    $.ajax({
        type : "GET",
        url : "/recipes/remarkable",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            for (var i = 0; i < response.length; i++) {
                $("#remarkable_recipes").append(
                    $(getRecipeCard(response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"],
                        RECIPE_CARD_RATING_DISPLAY_TOOL, response[i]["avgScore"])));
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });

    $.ajax({
        type : "GET",
        url : "/recipes/new",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            for (var i = 0; i < response.length; i++) {
                $("#new_recipes").append($(getRecipeCard(response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"])));
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });

    populateUserOnlyRecipeList();
}

function populateUserOnlyRecipeList() {
    if (getUserType() !== null) {
        $.ajax({
            type : "GET",
            url : "/recipes/favorite",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + getToken());
            },
            success : function (response) {
                for (var i = 0; i < response.length; i++) {
                    $("#favorite_recipes").append($(getRecipeCard(response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"])));
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });

        $.ajax({
            type : "POST",
            url : "/recipes/uploaded",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + getToken());
            },
            success : function (response) {
                for (var i = 0; i < response.length; i++) {
                    $("#uploaded_recipes").append(
                        $(getRecipeCard(response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"],
                            RECIPE_CARD_EDITOR_TOOL)));
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    }
}

function showRecipeList(id) {
    var list_container = $('#' + id).toggleClass('w3-show');
}