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
    });

    // load current user info
    currentUserInfo();

    // load recipe_card
    populateRecipeCards();

    //load user cards
    populateUserCards();

    // uploaded recipes is the default tab
    controlTab();

    //load notification messages
    populateNotifications({});
});

var defaultProfileImg = "/img/profile_picture.jpg";


function currentUserInfo() {
    var url = '/user/' + getUserID();

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
        success: function (user) {
            // update user info to UI
            if (user) {
                // information section
                // required user info
                $('#userName').html(user['userName']);
                // optional user info
                $('#email').html(user['email'] || "[Email is not provided]");
                $('#description').html(user['description'] || "[Description is not provided]");
                $('#profilePhoto').attr('src', user['profilePhoto'] || defaultProfileImg);

                // fill in edit profile form
                $('#editUserForm-photo').attr('src', user['profilePhoto'] || defaultProfileImg);
                $('#email-input').val(user['email']);
                $('#description-input').val(user['description']);
            }
        }
    });
}

// upload profile photo in edit profile form
function uploadProfilePhoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            sessionStorage.setItem("profilePhoto", e.target.result);
            $('#editUserForm-photo').attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/* Save User Profile changes */
function saveProfile(userId = getUserID()) {
    var url = '/user/' + userId;
    var params = {};

    var img = sessionStorage.getItem("profilePhoto");
    var email = $('#email-input').val();
    var description = $('#description-input').val();

    if (img && img != $('#profilePhoto').attr('src')) {
        params['profilePhoto'] = img;
    }
    if (email && email != $('#email').html()) {
        params['email'] = email;
    }
    if (description && description != $('#description').html) {
        params['description'] = description;
    }

    if ($('#editProfile-content')[0].checkValidity()) {
        $.ajax({
            url: url,
            type: "PUT",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + getToken());
            },
            statusCode: {
                401: function (response) {
                    console.error(response);
                }
            },
            success: function (user) {
                sessionStorage.removeItem("profilePhoto");
                location.reload();
                hide('edit-profile');
            }
        });
}
}

/* Save Reset Password */
function savePwd(userId = getUserID()) {
    var url = '/user/' + userId + '/password';
    var params = {'password': $('#oldPwd').val(), 'newPassword': $('.repeated-pwd:visible').val()};

    if (checkPasswordMatch()) {
        $.ajax({
            url: url,
            type: "PUT",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + getToken());
            },
            statusCode: {
                401: function (response) {
                    console.error(response);
                },
                403: function (response) {
                    console.error(response);
                    $('#invalidOldPwd').html('Password is incorrect.');
                }
            },
            success: function (user) {
                hide('reset-pwd');
            }
        });
}
}

function controlTab() {
    var user_type = getUserType();

    if (user_type === USER_TYPE_USER) {
        $('#notification-tab').hide();
        $('#users-tab').hide();
    }
    if (user_type === USER_TYPE_ADMIN) {
        $('#notification-tab').show();
        $('#users-tab').show();
        $('#user-section').hide();
        $('#notification-tab').addClass('w3-border-red');
    }
}

function filterNotification() {
    var params = {};

    var type = $("input[name=fileType]:checked").val();
    if (type == "favorite") {
        hide('commented');
        hide('favorited');
        hide('rated');
        hide('unFavorited');
        // clear params
        params = {};
        params['recipetype'] = 'favorite';
    } else {
        show('commented');
        show('favorited');
        show('rated');
        show('unFavorited');
        // clear params
        params = {};
        if (type == 'uploaded') {
            params['recipetype'] = 'uploaded';
        }
    }

    var actions = [];
    $("input[class=actionTypes]:checked").each(function () {
        var val = this.value;
        if (val == "updated") {
            actions.push('update');
        } else if (val == "deleted") {
            actions.push('delete');
        } else if (val == "commented") {
            actions.push('comment');
        } else if (val == "favorited") {
            actions.push('favorite');
        } else if (val == "unFavorited") {
            actions.push('unfavorite');
        } else {
            actions.push('rate');
        }
    });

    if(actions.length > 0){
        params['actiontype'] = actions;
    }

    populateNotifications(params);
}

// notification part
function populateNotifications(params) {
    var query = '/notification';

    if (params) {
        query = query + '?' + $.param(params);
    }
    console.log(query);
    $.ajax({
        url: query,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
        success: function (notifications) {
            console.log(notifications);
            $(".msg-card").html('');

            notifications.forEach(function (noti) {
                var fileType = noti['recipeOwnerId'] == getUserID() ? 'Your Uploaded Recipe ' : 'Your Favorite Recipe ';
                var msg = fileType + '<b>' + noti['recipeName'] + '</b>' +
                        noti['actionTypeMsg'] + '<b>' + noti['recipeOwnerName'] + '</b>';
                $(".msg-card").append($(getNotificationMsgs(noti['actionTypeId'], msg, noti['recipeId'])));
            });
        }
    });
}

function getNotificationMsgs(type, msg, recipeId) {
    var href = "/pages/recipe_view.html?id=" + recipeId;
    var labels = {};
    labels['0'] = "fa-star";
    labels['1'] = "fa-heart-o";
    labels['2'] = "fa-pencil";
    labels['3'] = "fa-commenting-o";
    labels['4'] = "fa-heart";
    labels['5'] = "fa-trash-o";

    return '<div class="w3-padding-large w3-card-2 w3-white w3-round w3-margin w3-hover-shadow"' +
            '" onclick="location.href=\'' + href + '\'">' +
            '<p><i class="fa ' + labels[type] + ' fa-fw w3-margin-right">' +
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

function populateRecipeCards() {
    var data = recipesData; // todo: load recipes data from database
    for (var i = 0; i < data.length; i++) {
        $(".uploaded-card").append($(getRecipeCard(null, data[i][0], data[i][1], data[i][2], RECIPE_CARD_EDITOR_TOOL)));
    }
}

function populateUserCards() {
    $.ajax({
        url: '/users',
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
        success: function (users) {
            // update user card
            users.forEach(function (user) {
                $(".user-card").append($(getUserCard(user['userName'], user['profilePhoto'] || defaultProfileImg, user['_id'])));
            });
        }
    });
}

function getUserCard(name, photo, id) {
    return '<section id="user-card-set" class="w3-white w3-card-2 w3-hover-shadow w3-margin w3-tooltip">' +
            '<img id="user-card-photo" src=' + photo + ' alt="Profile Photo">' +
            '<h4 class="w3-container w3-center">' + name + '</h4>' +
            '<div class="display-bottom">' +
            '<div id=' + id + ' class="w3-hover-text-blue w3-center w3-border edit_delete" onclick="deleteUser(this.id)">Delete</div>' +
            '<div class="w3-hover-text-blue w3-center w3-border edit_delete" onclick="show(\'edit-profile\');">Edit</div>' +
            '</div>' +
            '</section>';
}

// save the result of notification settings
function saveNotificationSetting() {
    // todo
}

function deleteUser(id) {
    deleteConfirm("user");
    
    var params = {'userId': id};
    $.ajax({
        url: '/user',
        type: "DELETE",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        statusCode: {
            401: function (response) {
                console.error(response);
            }
        },
        success: function (users) {
            // update user card
            users.forEach(function (user) {
                $(".user-card").append($(getUserCard(user['userName'], user['profilePhoto'] || defaultProfileImg)));
            });
        }
    });
}