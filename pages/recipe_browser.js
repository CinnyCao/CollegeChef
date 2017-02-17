$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        $('.site_name').html('<i class="fa fa-cutlery w3-hide-small"></i> Recipe Browser <i class="fa fa-cutlery fa-flip-horizontal w3-hide-small"></i>');
    });
});


function filterRecipes() {
	reset();
    var search_text = $('#recipe_browser_input').val().toLowerCase();
    var recipes = $(".recipe_card");

    for (i = 0; i < recipes.length; i++) {
        $(recipes[i]).toggle(recipes[i].title.toLowerCase().contains(search_text));
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
	    document.getElementById(str).style.fontWeight = "bold";

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
  		document.getElementById(str).style.fontWeight = "normal";
  	}
  	$('.recipe_card').show();
  	/*var recipes = $(".recipe_card");
  	for (i = 0; i < recipes.length; i++) {
	    $(recipes[i]).toggle();
	}*/
  	/*$(".abc").each(function(i, obj) {
		i.style.color = "white";
    	i.style.fontWeight = "normal";
	});*/
	/*var abc = document.querySelectorAll('.abc');
	for (var i = 0; i < abc.length; i++) {
  		abc[i].style.color = "green";
	}*/
	/*
	Array.prototype.forEach.call(abc, function(obj, i) {
    	i.style.color = "white";
    	i.style.fontWeight = "normal";
	});*/
	/*for (var i = 0; i < abc.length; i++) {   
   		[i].style.color = "white";
    	[i].style.fontWeight = "normal";
	}*/
}