/* JS functions used to control navbar */
$(function() {
    // hide menu items on start
    $('.menu_item').hide();
});

function showLinks() {
    $('.menu_item').toggle();
    // Hide site name when showing menu items in large and medium screen size
    if ($(window).width() > 600) {
        $('.site_name').toggle(!$('.menu_item').is(':visible'));
    }
}