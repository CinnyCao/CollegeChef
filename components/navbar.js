/* JS functions used to control navbar */
$(function() {

    // hide menu items on start
    $('.menu_item_left').hide();
    // hide right menu items on start too in small screen
    showHideRightMenuItems();
    $(window).on('resize', function () {
        showHideRightMenuItems();
        showHideSiteName();
    });

});

function showHideRightMenuItems() {
    $('.menu_item_right').toggle($(window).width() > 600 || ($(window).width() <= 600 && $('.menu_item_left').is(':visible')));
}

function showHideSiteName() {
    $('.site_name').toggle($(window).width() <= 600 || ($(window).width() > 600 && !$('.menu_item_left').is(':visible')));
}

function showLinks() {
    $('.menu_item_left').toggle();
    showHideRightMenuItems();
    // Hide site name when showing menu items in large and medium screen size
    showHideSiteName();
}

/* Login form */

function login(){
    // todo
}

/* Sign Up form */

function signup(){
    // todo
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

function checkPasswordMatch() {
    var password = $("#pwd").val();
    var confirmPassword = $("#repeated-pwd").val();

    if (password != confirmPassword)
        document.getElementById('repeated-pwd').title = 'Password does not match';
}

$(document).ready(function () {
    $("#repeated-pwd").keyup(checkPasswordMatch);
});