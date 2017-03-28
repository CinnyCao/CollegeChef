/**
 * Identification Info
 */
var USER_TYPE_USER = "user";
var USER_TYPE_ADMIN = "admin";

function getUserType() {
    return localStorage.getItem("userType");
}

function setUserType(isAdmin) {
    localStorage.setItem("userType", isAdmin ? USER_TYPE_ADMIN : USER_TYPE_USER);
}

function removeUserType() {
    localStorage.removeItem("userType");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

/** dummy data **/
var ingredientsData = [
    ["Egg", "/img/ingredients/egg.png"],
    ["Cheese", "/img/ingredients/cheese.png"],
    ["Eggplant", "/img/ingredients/eggplant.png"],
    ["Brown Sugar", "/img/ingredients/brown_sugar_ing.jpg"],
    ["Milk", "/img/ingredients/milk_ing.jpg"],
    ["Mushroom", "/img/ingredients/mushroom_ing.jpg"],
    ["Butter", "/img/ingredients/butter.jpg"],
    ["Salt", "/img/ingredients/salt_ing.jpg"]
];

var recipesData = [
    ["Meat Loaf",
        "This recipe is anything but regular old meatloaf! Everyone will love this moist version made in the slow cooker, with milk, mushrooms, and a little sage for extra flavor.",
        "/img/recipes/meatloaf.jpg"
    ],
    ["Scrambled Eggs",
        "This is the description",
        "/img/recipes/scrambledeggs.jpg"
    ],
    ["Ramen",
        "This is the description",
        "/img/recipes/ramen.jpg"
    ],
    ["Chicken Nuggets",
        "This is the description",
        "/img/recipes/chickennuggets.jpg"
    ],
    ["Steak",
        "This is the description",
        "/img/recipes/steak.jpg"
    ],
    ["BLT Sandwhich",
        "This is the description",
        "/img/recipes/bltsandwich.jpg"
    ],
    ["Pizza",
        "This is the description",
        "/img/recipes/pizza.jpg"
    ]
];

/**
 * Start-up Setup
 */
$(function () {
    //load footer
    $('#footer_holder').load('/components/footer.html', function () {
        updateNavMenuItems();
        $('#footer_holder').trigger('footerLoaded');
    });

    $('.addEditRecipeForm').load('/components/addEditRecipeForm.html');

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

/**
 * Global Functions
 */

function hide(id) {
    $('#' + id).hide();
}

function show(id) {
    $('#' + id).show();
}

function deleteConfirm(action) {
    var msg = "Are you sure you want to delete this " + action + "?";
    confirm(msg);
}

/**
 * Navigation Bar
 */

// Function that must be called when nav bar is loaded
function onNavBarLoaded() {
    // hide menu items on start
    $('.menu_item_left:not(.user_only)').hide();
    updateNavMenuItems();
    $(window).on('resize', function () {
        updateNavMenuItems();
    });
    $(".pwd-check").append($(getEnteredNewPwdPart()));
}

function showHideRightMenuItems() {
    $('.menu_item_right').toggle(getUserType() == null && ($(window).width() > 600 || ($(window).width() <= 600 && $('.menu_item_left').is(':visible'))));
}

function showHideSiteName() {
    $('.site_name').toggle($(window).width() <= 600 || ($(window).width() > 600 && !$('.menu_item_left').is(':visible')));
}

function showLinks() {
    // show hide links that are always present
    $('.menu_item_left:not(.user_only)').toggle(!$('.menu_item_left:not(.user_only)').is(':visible'));
    updateNavMenuItems();
}

function updateNavMenuItems() {
    var user_type = getUserType();
    // show hide user only links iff logged in and other left menu items is visible
    $('.user_only').toggle($('.menu_item_left:not(.user_only)').is(':visible') && (user_type === USER_TYPE_USER || user_type === USER_TYPE_ADMIN));
    showHideRightMenuItems();
    // Hide site name when showing menu items in large and medium screen size
    showHideSiteName();
}

/* Login form */
function login() {
    $('#loginUserNameFailed').html('');
    $('#loginPwdFailed').html('');
    var userName = $('#loginUserName').val();
    var password = $('#loginPwd').val();
    if (!userName) {
        $('#loginUserNameFailed').html('User name is required.');
    } else if (!password) {
        $('#loginPwdFailed').html('Password is required.');
    } else {
        var params = {
            "userName": userName,
            "password": password
        };

        $.ajax({
            url: "/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            statusCode: {
                403: function (response) {
                    $('#loginFailed').html(response.responseJSON['message']);
                    console.log(response);
                }
            },
            success: function (response) {
                setUserType(response["isAdmin"]);
                setToken(response["token"]);
                hide('login-form');
                updateNavMenuItems();
            }
        });
    }
}

/* Logout */
function logOut() {
    $.ajax({
        type : "GET",
        url : "/logout",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (response) {
            removeUserType();
            window.location.href = "/index.html";
        }
    });
}

/* Sign Up form */
function signUp() {
    // todo
}

/* Save Reset Password */
function savePwd() {
    // todo
}

/* Save User Profile */
function saveProfile() {
    // todo
}

/**
 * Footer
 */

function sendFeedback() {
    // todo
}

/**
 * Ingredient Button
 */

function getIngredientButton(title, src) {
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

/**
 *  entered new password part
 */

function getEnteredNewPwdPart() {
    var validation = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}";
    var hint = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
    return '' +
            '<label><b>New Password*</b></label>' +
            '<input class="new-pwd w3-input w3-border" type="password"' +
            ' placeholder="Enter New Password" name="newPwd" pattern=' + validation +
            ' title="' + hint + '" required>' +
            '<p class="w3-text-grey w3-margin-bottom">' + hint + '</p>' +
            '<label><b>Repeat New Password*</b></label>' +
            '<input class="repeated-pwd w3-input w3-border" type="password"' +
            ' placeholder="Please Repeat New Password" title="Passwords Do Not Match." name="repeatPwd" onkeyup="checkPasswordMatch()" required>';
}

/**
 * Recipe Card
 */

function getRecipeCard(name, description, src) {
    var href = "/pages/recipe_view.html"; // todo: generate different href to revipe_view page for different recipe
    return '' +
            '<div class="recipe_card w3-card-2 w3-hover-shadow" title="' + name + '" onclick="location.href=\'' + href + '\'">' +
            '<img src="' + src + '" alt="' + name + '">' +
            '<div class="w3-container w3-center">' +
            '<p class="recipe_card_title">' + name + '</p>' +
            '<p class="recipe_card_des">' + description + '</p>' +
            '</div>' +
            '</div>';
}

function ellipsisRecipeCardDescription() {
    var cards = $(".recipe_card_des");
    for (i = 0; i < cards.length; i++) {
        var des = $(cards[i]).text();
        if (des.length > 100) {
            $(cards[i]).text(des.substr(0, 100) + "...");
        }
    }
}

function addEditorToolsToRecipeCard() {
    var tools = '' +
            '<div class="recipe_card_tools_wrapper">' +
            '<i class="recipe_card_tools fa fa-trash fa-fw w3-hover-grey" onclick="event.stopPropagation(); deleteRecipe()"></i>' +
            '<i class="recipe_card_tools fa fa-pencil-square-o fa-fw w3-hover-grey" onclick="event.stopPropagation(); addEditRecipe(\'editRecipe\')"></i>' +
            '</div>';
    $('.recipe_card').append($(tools));
}

function deleteRecipe() {
    deleteConfirm("recipe");
    // todo
}

function saveRecipe() {
    // todo
}

var count = 2;

// values will be gotten from database and reset
function addEditRecipe(id) {
    // todo: load real data for edit recipe form
    count = 2;
    document.getElementById("recipe_form_title").innerHTML = (id == 'addRecipe') ? "Add a Recipe" : "Edit Recipe";
    document.getElementById("recipe_name").value = (id == 'addRecipe') ? "" : "Scrambled Eggs";
    document.getElementById("category").value = (id == 'addRecipe') ? "" : "Breakfast";
    document.getElementById("photo").value = (id == 'addRecipe') ? "" : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Brinner.jpg";
    document.getElementById("main_description").value = (id == 'addRecipe') ? "" : "Luscious, fluffy, and buttery scrambled eggs.";
    document.getElementById("servings").value = (id == 'addRecipe') ? "" : "1";
    document.getElementById("instructions").value = (id == 'addRecipe') ? "" : "1. Whisk eggs, milk, salt together until consistent; 2. Heat butter in pan; 3. Pour egg mixture into pan; 4. Let it sit for 15 seconds then stir; 5. Repeat until eggs are softly set";
    document.getElementById("tips").value = (id == 'addRecipe') ? "" : "Serve with black coffee.";
    document.getElementById("ingredient_list").innerHTML = "<div class='item' id='item1'><select id='ingredient1'" +
            "class='ing w3-input w3-border w3-margin-bottom' name='ingredient' required><option value='' disabled selected>" +
            "Select an ingredient</option></select><input id='quantity1' class='w3-input w3-border w3-margin-bottom'" +
            "name='quantity' placeholder='Enter ingredient quantity' required></div>";
    buildIngredientList(1);
    if (id == 'editRecipe') {
        document.getElementById("ingredient1").value = "Egg";
        document.getElementById("quantity1").value = "2";
        addIngredient();
        document.getElementById("ingredient2").value = "Milk";
        document.getElementById("quantity2").value = "6 tablespoons";
        addIngredient();
        document.getElementById("ingredient3").value = "Butter";
        document.getElementById("quantity3").value = "2 tablespoons";
        addIngredient();
        document.getElementById("ingredient4").value = "Salt";
        document.getElementById("quantity4").value = "1 teaspoon";
    }
    show('add-edit-recipe');
}

// Adds two fields for an additional ingredient and quantity to be inputted
function addIngredient() {
    var countPrev = count - 1;
    var ingredientPrev = document.getElementById("ingredient" + countPrev);
    var quantityPrev = document.getElementById("quantity" + countPrev);
    if (ingredientPrev.value != "" && quantityPrev.value != "") {
        var item = document.createElement('div');
        item.id = "item" + count;
        item.innerHTML = "<select id='ingredient" + count + "' class='added_ings w3-input w3-border w3-margin-bottom' name='ingredient'" +
                " required> <option value='' disabled selected>Select an ingredient</option>" +
                "</select> <input id='quantity" + count + "' class='w3-input w3-border w3-margin-bottom'" +
                "name='quantity' placeholder='Enter ingredient quantity' required>";
        document.getElementById("ingredient_list").appendChild(item);
        buildIngredientList(count);
        count++;
    } else {
        confirm("Please select an ingredient and quantity before adding additional ingredient fields.")
    }
}

function buildIngredientList(item_num) {
    var ingredient_id = "ingredient" + item_num;

    for (var i = 0; i < ingredientsData.length; i++) {
        var ingredient = document.createElement('option');
        ingredient.innerHTML = ingredientsData[i][0];
        document.getElementById(ingredient_id).appendChild(ingredient);
    }
}

// check whether password matches
function checkPasswordMatch() {
    var newPwdValue = $('.new-pwd:visible').val();
    var repeatPwdValue = $('.repeated-pwd:visible').val();
    if (newPwdValue != repeatPwdValue) {
        $('.repeated-pwd').addClass('w3-red');
    } else {
        $('.repeated-pwd').removeClass('w3-red');
    }
}