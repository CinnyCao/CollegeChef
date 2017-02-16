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

}

function cancel(){
    $('#login-form').hide();
}