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
function setUser(userObj) {
    localStorage.setItem("userObj", userObj);
}
function getToken() {
    return JSON.parse(localStorage.getItem("userObj"))["token"];
}
function getUserID() {
    return JSON.parse(localStorage.getItem("userObj"))["userId"];
}
function getUserName() {
    return JSON.parse(localStorage.getItem("userObj"))["userName"];
}
function setLoginRememberMe(rememberMe) {
    if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
    } else {
        localStorage.setItem("rememberMe", "false");
    }
}
function getLoginRememberMe() {
    if (localStorage.getItem("rememberMe") === "true") {
        return true;
    } else {
        return false;
    }
}
function getLoginUsername() {
    return localStorage.getItem("loginUserName");
}
function getLoginPassword() {
    return localStorage.getItem("loginPassword");
}
function setLoginUsername(username) {
    if (username !== "") {
        localStorage.setItem("loginUserName", username);
    } else {
        localStorage.removeItem("loginUserName");
    }
}
function setLoginPassword(password) {
    if (password !== "") {
        localStorage.setItem("loginPassword", password);
    } else {
        localStorage.removeItem("loginPassword");
    }
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

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

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
    $('.menu_add_recipe').toggle(getUserType() != null && ($(window).width() > 600 || ($(window).width() <= 600 && $('.menu_item_left').is(':visible'))));
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
function getLoginForm() {
    if (getLoginRememberMe()) {
        $("#loginUserName").val(getLoginUsername());
        $("#loginPwd").val(getLoginPassword());
        $("#login_remember_me").attr("checked", true);
    }
    show("login-form");
}

function login() {
    var userName = $('#loginUserName').val();
    var password = $('#loginPwd').val();
    if (userName && password) {
        var params = {
            "userName": userName,
            "password": password
        };
        
        loginHelper(params);
    }
}

function loginHelper(params) {
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
            // remember password if required
            var rememberMe = $("#login_remember_me").is(":checked");
            if (rememberMe) {
                setLoginRememberMe(true);
                setLoginUsername(userName);
                setLoginPassword(password);
            } else {
                setLoginRememberMe(false);
                setLoginUsername("");
                setLoginPassword("");
            }

            setUserType(response["isAdmin"]);
            setUser(JSON.stringify(response));
            hide('login-form');
            updateNavMenuItems();
            $(window).trigger("loggedin");
        }
    });
}

/* Logout */
function logOut() {
    $.ajax({
        type: "GET",
        url: "/logout",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            removeUserType();
            window.location.href = "/index.html";
        }
    });
}

/* Sign Up form */
function signUp() {
    var userName = $('#signUpUserName').val();
    var pwd = $('.repeated-pwd:visible').val();
    
    if (userName && pwd && checkPasswordMatch()) {
        var params = {'userName': userName, 'password': pwd};
        
            $.ajax({
            url: "/user",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            statusCode: {
                403: function (response) {
                    $('#usernameExist').html(response.responseJSON['message']);
                    console.log(response);
                }
            },
            success: function (response) {
                hide('register-form');
                // login with the new created user
                loginHelper(params);
            }
        });
    }   
}


/**
 * Footer
 */

function sendFeedback() {
    var name = $('#fbName').val();
    var email = $('#fbEmail').val();
    var feedback = $('#feedback').val();
    var params = {};

    if (feedback) {
        params.feedback = feedback;
    }
    if (name) {
        params.name = name;
    }
    if (email) {
        params.email = email;
    }

    if (feedback) {
        $.ajax({
            url: "/feedback",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            success: function (response) {
                hide('give-feedback');
            }
        });
    }
}

/**
 * Ingredient Button
 */

function getIngredientButton(id, title, src) {
    return '' +
            '<a class="ingredient_button w3-center" href="#" title="' + title + '" data-id="' + id + '">' +
            '<img src="' + src + '" alt="' + title + '"><p>' + title + '</p>' +
            '</a>';
}

/**
 *  entered new password part
 */

function getEnteredNewPwdPart() {
    var hint = "Must contain blahblah, pattern will be added later!!!!!!!";
    return '' +
            '<label><b>New Password*</b></label>' +
            '<input class="new-pwd w3-input w3-border" type="password"' +
            ' placeholder="Enter New Password"' +
            ' title="' + hint + '" required>' +
            '<p class="w3-text-grey w3-margin-bottom">' + hint + '</p>' +
            '<label><b>Repeat New Password*</b></label>' +
            '<input class="repeated-pwd w3-input w3-border" type="password"' +
            ' placeholder="Please Repeat New Password" title="Passwords Do Not Match." onkeyup="checkPasswordMatch()" required>';
}

/**
 * Recipe Card
 */

var RECIPE_CARD_EDITOR_TOOL = "EDITOR";
var RECIPE_CARD_RATING_DISPLAY_TOOL = "RATING_DISPLAY";
var RECIPE_CARD_COMMENT_COUNT_TOOL = "COMMENT_COUNT";
var RECIPE_CARD_FAVORITE_BUTTON_TOOL = "FAVORITE_BUTTON";
var RECIPE_CARD_DISPLAY = "DISPLAY";
var RECIPE_CARD_BROWSER = "BROWSER";

function getRecipeCard(id, name, description, src, tool, toolData) {
    var href = "/pages/recipe_view.html?id=" + id;
    // ellipsis description
    if (tool !== RECIPE_CARD_DISPLAY && description.length > 100) {
        description = description.substr(0, 100) + "...";
    }
    // add tool if requested
    var editorTool = "";
    var ratingTool = "";
    var commentTool = "";
    var favoriteTool = "";
    var usernameTool = "";
    if (tool === RECIPE_CARD_EDITOR_TOOL || tool === RECIPE_CARD_BROWSER) {
        editorTool = '' +
                '<div class="recipe_card_editor_tools recipe_card_tools_wrapper recipe_card_tools_wrapper_top_right">' +
                '<i class="recipe_card_tools fa fa-trash fa-fw w3-hover-grey" onclick="event.stopPropagation(); deleteRecipe()"></i>' +
                '<i class="recipe_card_tools fa fa-pencil-square-o fa-fw w3-hover-grey" onclick="event.stopPropagation(); addEditRecipe(\'editRecipe\')"></i>' +
                '</div>';
    }
    if (tool === RECIPE_CARD_RATING_DISPLAY_TOOL || tool === RECIPE_CARD_DISPLAY) {
        var rating;
        if (tool === RECIPE_CARD_DISPLAY) {
            rating = toolData["avgRating"];
        } else {
            rating = toolData;
        }
        ratingTool = '<div class="recipe_card_tools_wrapper rating_display" title="Average Rating: ' + rating + '">';
        rating = Math.ceil(rating); // todo: display half star for 0.5 score
        for (var i = 0; i < 5 - rating; i++) {
            ratingTool += '<lable class="rating_display_star_grey"></lable>';
        }
        for (var i = 0; i < rating; i++) {
            ratingTool += '<label class="rating_display_star_gold"></label>';
        }
        ratingTool += '</div>';
    }
    if (tool === RECIPE_CARD_COMMENT_COUNT_TOOL) {
        commentTool = '<div class="recipe_card_tools_wrapper comment_count">' +
                '<img src="/img/comment.png" alt="Num of Comments:">' +
                '<p>x' + toolData + '</p>' +
                '</div>';
    }
    if (tool == RECIPE_CARD_BROWSER) {
        usernameTool = '<div class="uploader_info recipe_card_tools_wrapper">' +
            '<p data-username="' + toolData + '"><small>Uploaded by:</small><br>' + toolData + '</p>' +
            '</div>';
    }
    if (tool === RECIPE_CARD_FAVORITE_BUTTON_TOOL || tool === RECIPE_CARD_DISPLAY) {
        var isFavorited = toolData;
        if (tool === RECIPE_CARD_DISPLAY) {
            isFavorited = toolData["isFavorited"];
        }
        var favorited = "";
        var hint = "";
        if (isFavorited) {
            favorited = "favoritedHeart";
            hint = "Click to unfavorite";
        } else {
            hint = "Click to favorite";
        }
        favoriteTool = '' +
                '<div class="recipe_card_tools_wrapper recipe_card_tools_wrapper_top_right" title="' + hint + '">' +
                '<i class="recipe_card_tools ' + favorited + ' fa fa-heart fa-fw w3-hover-grey" onclick="event.stopPropagation(); toggleFavorite()"></i>' +
                '</div>';
    }

    var cardCode = '';
    if (tool === RECIPE_CARD_DISPLAY) {
        cardCode += '<div class="recipe_card_display w3-card-4 w3-margin w3-white">';
    } else {
        cardCode += '<div class="recipe_card w3-card-2 w3-hover-shadow" title="' + name + '" onclick="location.href=\'' + href + '\'">';
    }
    cardCode += '<span class="recipe_card_img_wrapper"><img src="' + src + '" alt="' + name + '">' + ratingTool + '</span>';
    cardCode += '<div class="w3-container w3-center">';
    // name
    cardCode += '<p class="recipe_card_title">' + name + '</p>';
    if (tool === RECIPE_CARD_DISPLAY) {
        // category and num of servings
        cardCode += '' +
            '<div class="recipe_card_category_serving">' +
            '<p><b>Category: </b>' + toolData["categoryName"] + '</p>' + '<p><b>Num of Servings: </b>' + toolData["numServings"] + '</p>' +
            '</div>';
    }
    // description
    cardCode += '<p class="recipe_card_des">' + description + '</p>';
    // top corner tools
    cardCode += '' +
            '</div>' +
                editorTool + commentTool + favoriteTool + usernameTool +
            '</div>';
    return cardCode;
}

function deleteRecipe() {
    deleteConfirm("recipe");
    // todo
}

function saveRecipe() {
    // todo
}

function toggleFavorite() {
    // todo
}

var count = 2;

// values will be gotten from database and reset
function addEditRecipe(id) {
    //todo: load real data for edit recipe form
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
        return false;
    } else {
        $('.repeated-pwd').removeClass('w3-red');
        return true;
    }
}