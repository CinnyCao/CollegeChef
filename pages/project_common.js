/**
 * Global Variables
 */

var user_type = "none";


/**
 * Start-up Setup
 */
$(function() {
    //load footer
    $('#footer_holder').load('/components/footer.html', function () {
        $(".user_radio").on('click', function () {
            user_type = $('input[name=user_type]:checked').val();
            // update links' visibility in nav bar
            updateNavMenuItems();
        });
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

function hide(id){
    $('#' + id).hide();
}

function show(id){
    $('#' + id).show();
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
}

function showHideRightMenuItems() {
    $('.menu_item_right').toggle(user_type == "none" && ($(window).width() > 600 || ($(window).width() <= 600 && $('.menu_item_left').is(':visible'))));
}

function showHideSiteName() {
    $('.site_name').toggle($(window).width() <= 600 || ($(window).width() > 600 && !$('.menu_item_left').is(':visible')));
}

function showLinks() {
    // show hide links that are always present
    $('.menu_item_left:not(.user_only)').toggle();
    updateNavMenuItems();
}

function updateNavMenuItems() {
    // show hide user only links iff logged in and other left menu items is visible
    $('.user_only').toggle($('.menu_item_left:not(.user_only)').is(':visible') && (user_type == "user" || user_type == "admin"));
    showHideRightMenuItems();
    // Hide site name when showing menu items in large and medium screen size
    showHideSiteName();
}

/* Login form */
function login(){
    // todo
    // close the form after saving
    hide('login-form');
}

/* Sign Up form */
function signUp(){
    // todo
    // close the form after saving
    hide('register-form');
}

/* Save Reset Password */
function savePwd(){
    // todo
    // close the form after saving
    hide('reset-pwd');
}

/* Save User Profile */
function saveProfile(){
    // todo
    // close the form after saving
    hide('edit-profile');
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

// check whether password matches
function checkPasswordMatch(newPwd, repeatPwd) {
    var newPwdValue = $('#' + newPwd).val();
    var repeatPwdValue = $('#' + repeatPwd).val();
    if(newPwdValue != repeatPwdValue){
        $('.repeated-pwd').addClass('w3-red');
    }
    else{
        $('.repeated-pwd').removeClass('w3-red');
    }
}