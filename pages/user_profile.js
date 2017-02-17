$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        $('.site_name').html('My Profile');
    });

    // load recipe_card
    $('#uploaded-list').load('/components/recipe_card.html');

    // uploaded recipes is the default tab
    $('#uploaded-list').show();
    $('#uploaded-recipes-tab').addClass('w3-border-red');

    // this part will be modified later, decided by status of user(Admin or User)
    twoTab();
});

function openAccordions(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function openTab(evt, tabName) {
    var i, x, tablinks;
  x = document.getElementsByClassName("set-tab");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
     tablinks[i].className = tablinks[i].className.replace(" w3-border-red", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.firstElementChild.className += " w3-border-red";
}

// These two methods will be modified when able to get the status of user(Admin or User)
function twoTab() {
    $('.half-or-forth').removeClass('w3-quarter');
    $('.half-or-forth').addClass('w3-half');
    // Hide users list and all recipes list section for users
    $('#users-tab').hide();
    $('#recipes-tab').hide();
}

function fourTab() {
    $('.half-or-forth').removeClass('w3-half');
    $('.half-or-forth').addClass('w3-quarter');
    // Show users list and all recipes list section for Admin
    $('#users-tab').show();
    $('#recipes-tab').show();
}

// save the result of notification settings
function saveNotificationSetting(){
    // todo
}

function deleteUser(){
    // todo
}

function deleteRecipe(){
  // todo
}

function editRecipe() {
    // Sample data
    document.getElementById("add_title").innerHTML="Edit Recipe";
    document.getElementById("recipename").value="Scrambled Eggs";
    document.getElementById("category").value="Breakfast";
    document.getElementById("photo").value="https://upload.wikimedia.org/wikipedia/commons/1/1e/Brinner.jpg";
    document.getElementById("shortdescription").value="Luscious, fluffy, and buttery scrambled eggs.";
    document.getElementById("ingredientlist").value="1. 2 eggs; 2. 6 tbsp whole milk; 3. 2 tbsp butter; 4. pinch of salt";
    document.getElementById("servings").value="1";
    document.getElementById("instructions").value="1. Whisk eggs, milk, salt together until consistent; 2. Heat butter in pan; 3. Pour egg mixture into pan; 4. Let it sit for 15 seconds then stir; 5. Repeat until eggs are softly set";
    document.getElementById("tips").value="Serve with black coffee.";
    document.getElementById("longdescription").value="";
    show('add-recipe');
}

function addRecipe() {
    document.getElementById("add_title").innerHTML="Add a Recipe";
    document.getElementById("recipename").value="";
    document.getElementById("category").value="";
    document.getElementById("photo").value="";
    document.getElementById("shortdescription").value="";
    document.getElementById("ingredientlist").value="";
    document.getElementById("servings").value="";
    document.getElementById("instructions").value="";
    document.getElementById("tips").value="";
    document.getElementById("longdescription").value="";
    show('add-recipe');
}