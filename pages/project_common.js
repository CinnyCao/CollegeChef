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

// upload profile photo in edit profile form
function uploadPhoto(input, imgElement, storeName) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            sessionStorage.setItem(storeName, e.target.result);
            $('#' + imgElement).attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
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
                setLoginUsername(params["userName"]);
                setLoginPassword(params["password"]);
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
        url: '/logout',
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
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
        for (var i = 0; i < 5 - Math.ceil(rating); i++) {
            ratingTool += '<lable class="rating_display_star_grey"></lable>';
        }
        if (rating - Math.floor(rating) > 0) {
            ratingTool += '<lable class="rating_display_star_half"></lable>';
        }
        for (var i = 0; i < Math.floor(rating); i++) {
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
    hide('add-edit-recipe');
}

function toggleFavorite() {
    // todo
}

// add recipe form
var count = 2;

function listCategories() {
    $.ajax({
        url: '/categories',
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            403: function (response) {
                console.error(response);
            }
        },
        success: function (categories) {
            $.each(categories, function (i, category) {
                $('#category').append($('<option>', {
                    value: category._id,
                    text : category.name 
                }));
            });
        }
    });
}

function listIngredients() {
    $.ajax({
        type : "GET",
        url : "/ingredients",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (ingredients) {
            $.each(ingredients, function (i, ingredient) {
                $('.ingredientList').append($('<option>', {
                    value: ingredient._id,
                    text : ingredient.name 
                }));
            });
        }
    });
}

function addIngredientListTemplate(){
    return '<div class="oneIgredient w3-margin-bottom">' +
    '<div class="w3-container">' + 
    '<select class="ingredientList input-set added_ings w3-border w3-margin-right w3-left" required>' +
    '<option value="" selected>Select an ingredient</option>' +
    '</select>' +
    '<input class="quantity input-set w3-border w3-margin-right w3-left" placeholder="Enter ingredient quantity" required>' +
    '<i class="timesBtn w3-hover-text-blue w3-xlarge fa fa-times w3-left" onClick="deleteIngredient(this);"></i>' + 
    '</div>' +
    '<p class="invalidIngredientInput w3-text-red w3-hide">Please select an ingredient and enter the quality.</p>' +
    '</div>'
}

function addIngredient(){
    $(".eachIngredient").append(addIngredientListTemplate());
    listIngredients();
    checkIngredientAmount();
}

function deleteIngredient(current){
    $(current).parent().remove();
    // fix later
    //$(".eachIngredient").first().prepend();
    checkIngredientAmount();
}

function checkIngredientAmount() {
    console.log($(".oneIgredient"));
    if($(".oneIgredient").length == 1) {
        $('.timesBtn').addClass('w3-hide');
    } else {
        $('.timesBtn').removeClass('w3-hide');
    }
}

// values will be gotten from database and reset
function addEditRecipe(id) {
    listCategories();
    listIngredients();
    show('add-edit-recipe');
    addIngredient();

    // if list < 1, invisible the cross
    checkIngredientAmount();
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