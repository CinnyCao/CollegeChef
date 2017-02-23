$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        $('.site_name').html('<i class="fa fa-user-o"></i> My Profile');
    });

    // load recipe_card
    $('.uploaded-card').load('/components/recipe_card.html');

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

function saveRecipe(){
  // todo
}

// value will be got from database and reset
function addEditRecipe(id) {
    document.getElementById("add_title").innerHTML= (id == 'addRecipe') ? "Add a Recipe" : "Edit Recipe";
    document.getElementById("recipename").value= (id == 'addRecipe') ? "" : "Scrambled Eggs";
    document.getElementById("category").value=(id == 'addRecipe') ? "" : "Breakfast";
    document.getElementById("photo").value=(id == 'addRecipe') ? "" : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Brinner.jpg";
    document.getElementById("shortdescription").value=(id == 'addRecipe') ? "" : "Luscious, fluffy, and buttery scrambled eggs.";
    document.getElementById("ingredientlist").value=(id == 'addRecipe') ? "" : "1. 2 eggs; 2. 6 tbsp whole milk; 3. 2 tbsp butter; 4. pinch of salt";
    document.getElementById("servings").value=(id == 'addRecipe') ? "" : "1";
    document.getElementById("instructions").value=(id == 'addRecipe') ? "" : "1. Whisk eggs, milk, salt together until consistent; 2. Heat butter in pan; 3. Pour egg mixture into pan; 4. Let it sit for 15 seconds then stir; 5. Repeat until eggs are softly set";
    document.getElementById("tips").value=(id == 'addRecipe') ? "" : "Serve with black coffee.";
    document.getElementById("longdescription").value=(id == 'addRecipe') ? "" : "";
    show('add-edit-recipe');
}

// will be modified later and pass the real user information
function editProfile(){
    document.getElementById("name-input").value="Monkey.D.Luffy";
    document.getElementById("email-input").value="team02@gmail.com";
    document.getElementById("description-input").value="We are team02. Our team members are Becky, Cinny, Morgan, Tanay.";
}