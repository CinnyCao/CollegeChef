/** dummy data **/
var msgs = [
    [1, "Becky", "Meat Loaf"],
    [2, "Cinny", "Scrambled Eggs"],
    [3, "Sean", "Ramen"],
    [4, "Tanay", "Chicken Nuggets"]
];

var users = [
    ["Team02", "/img/profile_picture.jpg"],
    ["team002", "/img/profile_picture.jpg"],
    ["team0002", "/img/profile_picture.jpg"]
]

$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
        $('.site_name').html('<i class="fa fa-user-o"></i> My Profile');
    });

    $('#footer_holder').on('footerLoaded', function () {
        //hide no user option in user type controller
        updateNavMenuItems();

        displayUserProfilePageContent();
    });

    // load current user info
    currentUserInfo();

    // load recipe_card
    populateRecipeCards();

    //load notification messages
    populateNotifications();

    //load user cards
    populateUserCards();

    // uploaded recipes is the default tab
    $('#uploaded-list').show();
    $('#uploaded-recipes-tab').addClass('w3-border-red');

    // this part will be modified later, decided by status of user(Admin or User)
    twoTab();
});

function currentUserInfo() {
    var userObj = JSON.parse(window.localStorage.getItem('userObj'));
    var url = '/user/' + userObj['userId'];

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + userObj['token']);
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
        success: function (user) {
            // update user info to UI
            if (user) {
                // required user info
                $('#userName').html(user['userName']);
                
                // optional user info
                $('#email').html(user['email'] || "Email is not provided");
                $('#description').html(user['description'] || "Description is not provided");
                $('#profilePhoto').attr('src', user['profilePhoto'] || "/img/profile_picture.jpg");
            }
        }
    });
}

function displayUserProfilePageContent() {
    var user_type = getUserType();
    if (user_type === USER_TYPE_USER) {
        twoTab();
    }
    if (user_type === USER_TYPE_ADMIN) {
        fourTab();
    }
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

function populateRecipeCards() {
    var data = recipesData; // todo: load recipes data from database
    for (var i = 0; i < data.length; i++) {
        $(".uploaded-card").append($(getRecipeCard(data[i][0], data[i][1], data[i][2], RECIPE_CARD_EDITOR_TOOL)));
    }
}

function populateNotifications() {
    var dataSet = msgs;
    dataSet.forEach(function (msg) {
        $(".msg-card").append($(getNotificationMsgs(msg[0], msg[1], msg[2])));
    });
}

function populateUserCards() {
    var usersDsta = users;
    usersDsta.forEach(function (user) {
        $(".user-card").append($(getUserCard(user[0], user[1])));
    });
}

function getUserCard(name, photo) {
    return '<section id="user-card-set" class="w3-white w3-card-2 w3-hover-shadow w3-margin w3-tooltip">' +
            '<img id="user-card-photo" src=' + photo + ' alt="Profile Photo">' +
            '<h4 class="w3-container w3-center">' + name + '</h4>' +
            '<div class="display-bottom">' +
            '<div class="w3-hover-text-blue w3-center w3-border edit_delete" onclick="deleteUser()">Delete</div>' +
            '<div class="w3-hover-text-blue w3-center w3-border edit_delete" onclick="show(\'edit-profile\'); editProfile()">Edit</div>' +
            '</div>' +
            '</section>';
}

//4 notification types: rated(1), commented(2), favorite(3), uploaded(4)
function getNotificationMsgs(type, name, recipeName) {
    var href = "/pages/recipe_view.html";
    var msg = "";
    var label = "";
    var href = "/pages/recipe_view.html";
    if (type == 1) {
        msg = "Your Recipe <b>" + recipeName + "</b> is rated by " + name + "!";
        label = "fa-star";
    } else if (type == 2) {
        msg = "Your Recipe <b>" + recipeName + "</b> is commented by " + name + "!";
        label = "fa-commenting-o";
    } else if (type == 3) {
        msg = "Your Favorite Recipe <b>" + recipeName + "</b> has been modified by " + name + "!";
        label = "fa-heart";
    } else if (type == 4) {
        msg = "Your Recipe <b>" + recipeName + "</b> has been modified by " + name + "!";
        label = "fa-book";
    } else {
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
    document.getElementById("email-input").value = "team02@gmail.com";
    document.getElementById("description-input").value = "We are team02. Our team members are Becky, Cinny, Sean, Tanay.";
}