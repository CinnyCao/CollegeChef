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
        "/img/recipes/chickennuggets.jpg"]
];

var msgs = [
    [1, "Becky", "Meat Loaf"],
    [2, "Cinny", "Scrambled Eggs"],
    [3, "Morgan", "Ramen"],
    [4, "Tanay", "Chicken Nuggets"]
];


$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        $('.site_name').html('<i class="fa fa-user-o"></i> My Profile');
    });

    // load recipe_card
    populateRecipeCards();
    ellipsisRecipeCardDescription();
    
    //load notification messages
    populateNotifications();

    // uploaded recipes is the default tab
    $('#uploaded-list').show();
    $('#uploaded-recipes-tab').addClass('w3-border-red');

    // this part will be modified later, decided by status of user(Admin or User)
    twoTab();
});

function populateRecipeCards() {
    var data = recipes; // todo: load recipes data from database
    for (var i = 0; i < data.length; i++) {
        $(".uploaded-card").append($(getRecipeCard(data[i][0], data[i][1], data[i][2])));
    }
    addEditorToolsToRecipeCard();
}

function populateNotifications() {
    var dataSet = msgs;
    dataSet.forEach(function (msg) {
        $(".msg-card").append($(getNotificationMsgs(msg[0], msg[1], msg[2])));
    });
}

//4 notification types: rated(1), commented(2), favorite(3), uploaded(4)
function getNotificationMsgs(type, name, recipeName) {
    var href = "/pages/recipe_view.html";
    var msg = "";
    var label = "";
    var href = "/pages/recipe_view.html";
    if(type == 1){
        msg = "Your Recipe <b>" + recipeName + "</b> is rated by " + name + "!";
        label = "fa-star";
    }
    else if(type == 2){
        msg = "Your Recipe <b>" + recipeName + "</b> is commented by " + name + "!";
        label = "fa-commenting-o";
    }
    else if(type == 3){
        msg = "Your Favorite Recipe <b>" + recipeName + "</b> has been modified by " + name + "!";
        label = "fa-heart";
    }
    else if(type == 4){
        msg = "Your Uploaded Recipe <b>" + recipeName + "</b> has been modified by " + name + "!";
        label = "fa-book";
    }
    else{
                //invalid notification type        
    }
    return '<div class="w3-padding-large w3-card-2 w3-white w3-round w3-margin w3-hover-shadow"' +
            '" onclick="location.href=\'' + href + '\'">' +
            '<p><i class="fa ' + label + ' fa-fw w3-margin-right">' +
            '</i>' + msg + '</p>' +
            '</div>';
}

// open tab
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
function saveNotificationSetting() {
    // todo
}

function deleteUser() {
    deleteConfirm("user");
    // todo
}

// will be modified later and pass the real user information
function editProfile() {
    document.getElementById("profile-photo").value = "http://pre06.deviantart.net/7bfd/th/pre/i/2011/287/a/e/luffy_chibi_head_by_fuwafuwapanda-d4crymp.jpg";
    document.getElementById("name-input").value = "Team02";
    document.getElementById("email-input").value = "team02@gmail.com";
    document.getElementById("description-input").value = "We are team02. Our team members are Becky, Cinny, Morgan, Tanay.";
}

function deleteRecipe() {
    deleteConfirm("recipe");
    // todo
}

function saveRecipe() {
    // todo
}

// value will be got from database and reset
function addEditRecipe(id) {
    document.getElementById("recipe_form_title").innerHTML = (id == 'addRecipe') ? "Add a Recipe" : "Edit Recipe";
    document.getElementById("recipename").value = (id == 'addRecipe') ? "" : "Scrambled Eggs";
    document.getElementById("category").value = (id == 'addRecipe') ? "" : "Breakfast";
    document.getElementById("photo").value = (id == 'addRecipe') ? "" : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Brinner.jpg";
    document.getElementById("shortdescription").value = (id == 'addRecipe') ? "" : "Luscious, fluffy, and buttery scrambled eggs.";
    document.getElementById("ingredientlist").value = (id == 'addRecipe') ? "" : "1. 2 eggs; 2. 6 tbsp whole milk; 3. 2 tbsp butter; 4. pinch of salt";
    document.getElementById("servings").value = (id == 'addRecipe') ? "" : "1";
    document.getElementById("instructions").value = (id == 'addRecipe') ? "" : "1. Whisk eggs, milk, salt together until consistent; 2. Heat butter in pan; 3. Pour egg mixture into pan; 4. Let it sit for 15 seconds then stir; 5. Repeat until eggs are softly set";
    document.getElementById("tips").value = (id == 'addRecipe') ? "" : "Serve with black coffee.";
    document.getElementById("longdescription").value = (id == 'addRecipe') ? "" : "";
    show('add-edit-recipe');
}

function deleteConfirm(action) {
    var msg = "Are you sure you want to delete this " + action + "?";
    confirm(msg);
}