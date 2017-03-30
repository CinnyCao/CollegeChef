$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
        $('.site_name').html('<i class="fa fa-cutlery w3-hide-small"></i> Recipe Browser <i class="fa fa-cutlery fa-flip-horizontal w3-hide-small"></i>');
    });

    $('#footer_holder').on('footerLoaded', function () {
        // load recipe_card
        populateRecipeCards();

        showHideRecipeEditorTools();
    });
});

function populateRecipeCards() {
    $.ajax({
        type : "GET",
        url : "/recipes",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            for (var i = 0; i < response.length; i++) {
                $(".recipe_cards_wrapper").append($(getRecipeCard(response[i]["_id"], response[i]["recipeName"], response[i]["description"], response[i]["imgUrl"], RECIPE_CARD_EDITOR_TOOL)));
            }
            showHideRecipeEditorTools();
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function showHideRecipeEditorTools() {
    var user_type = getUserType();
    $('.recipe_card_tools_wrapper').toggle(user_type === USER_TYPE_ADMIN);
}

// Display recipes with recipe names that contain the entered input
function filterRecipes() {
    reset();
    var search_text = $('#recipe_browser_input').val().toLowerCase();
    var recipes = $(".recipe_card");

    for (i = 0; i < recipes.length; i++) {
        $(recipes[i]).toggle(recipes[i].title.toLowerCase().indexOf(search_text) >= 0);
    }
}

// Displays recipes that start with the selected letter
function letter(a) {
    var str = a.id;
    if (document.getElementById(str).style.color == "red") {
        reset();
    } else {
        reset();
        document.getElementById("recipe_browser_input").value = "";
        document.getElementById(str).style.color = "red";

        var letter = $('#' + str).val().toLowerCase();
        var recipes = $(".recipe_card");

        for (i = 0; i < recipes.length; i++) {
            $(recipes[i]).toggle(recipes[i].title.toLowerCase().startsWith(letter));
        }
    }
}

// Resets letter button colors to an unselected white
function reset() {
    var str = 0;
    for (var i = 1; i < 27; i++) {
        str = [i];
        document.getElementById(str).style.color = "white";
    }
    $('.recipe_card').show();
}