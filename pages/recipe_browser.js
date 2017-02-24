/** dummy data **/
var recipes = [
    ["Meat Loaf",
        "This recipe is anything but regular old meatloaf! Everyone will love this moist version made in the slow cooker, with milk, mushrooms, and a little sage for extra flavor.",
        "/img/recipes/meatloaf.jpg"],
    ["Scrambled Eggs",
        "This is the description",
        "/img/recipes/scrambledeggs.jpg"],
    ["Ramen",
        "This is the description",
        "/img/recipes/ramen.jpg"],
    ["Chicken Nuggets",
        "This is the description",
        "/img/recipes/chickennuggets.jpg"],
    ["Steak",
        "This is the description",
        "/img/recipes/steak.jpg"],
    ["BLT Sandwhich",
        "This is the description",
        "/img/recipes/bltsandwich.jpg"],
    ["Pizza",
        "This is the description",
        "/img/recipes/pizza.jpg"]
];

$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        $('.site_name').html('<i class="fa fa-cutlery w3-hide-small"></i> Recipe Browser <i class="fa fa-cutlery fa-flip-horizontal w3-hide-small"></i>');
    });

    // load recipe_card
    populateRecipeCards();
    ellipsisRecipeCardDescription();
});

function populateRecipeCards() {
    var data = recipes; // todo: load recipes data from database
    for (var i = 0; i < data.length; i++) {
        $(".recipe_cards_wrapper").append($(getRecipeCard(data[i][0], data[i][1], data[i][2])));
    }
}

function filterRecipes() {
	reset();
    var search_text = $('#recipe_browser_input').val().toLowerCase();
    var recipes = $(".recipe_card");

    for (i = 0; i < recipes.length; i++) {
        $(recipes[i]).toggle(recipes[i].title.toLowerCase().indexOf(search_text) >= 0);
    }
}

function letter(a) {
	var str = a.id;
	if (document.getElementById(str).style.color == "red") {
		reset();
	} else {
		reset();
		document.getElementById("recipe_browser_input").value = "";
		document.getElementById(str).style.color = "red";

	    var letter = $('#'+str).val().toLowerCase();
		var recipes = $(".recipe_card");

		for (i = 0; i < recipes.length; i++) {
	    	$(recipes[i]).toggle(recipes[i].title.toLowerCase().startsWith(letter));
		}
	}
}

function reset() {
	var str = 0;
	for (var i = 1; i < 27; i++) {
		str = [i];
  		document.getElementById(str).style.color = "white";
  	}
  	$('.recipe_card').show();
}