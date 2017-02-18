$(function() {
    ellipsisRecipeCardDescription();
});

function ellipsisRecipeCardDescription() {
    var cards = $(".recipe_card_des");
    for (i = 0; i < cards.length; i++) {
        var des = $(cards[i]).text();
        if (des.length > 100) {
            $(cards[i]).text(des.substr(0, 100) + "...");
        }
    }
}