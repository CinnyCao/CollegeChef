$(function () {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
    });

    // get recipe data
    fetchRecipeDetail();
});

function fetchRecipeDetail() {
    $.ajax({
        type: "GET",
        url: "/recipe/" + getUrlParameter("id"),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (recipeResponse) {
            if (getUserType() == null) {
                recipeResponse["hasFavorited"] = false;
                loadRecipeDetail(recipeResponse);
            } else {
                recipeResponse["hasFavorited"] = true;
                // get is favorited
                $.ajax({
                    type: "GET",
                    url: "/recipe/" + getUrlParameter("id") + "/favorite",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + getToken());
                    },
                    success: function (favoriteResponse) {
                        recipeResponse["isFavorited"] = favoriteResponse["isFavorited"];
                        loadRecipeDetail(recipeResponse);
                        getAllTextComments();
                        getAllImgComments();
                    },
                    error: function (request, status, error) {
                        alert(request.responseText);
                    }
                });
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function loadRecipeDetail(recipeResponse) {
    sessionStorage.setItem('currentRecipeId', recipeResponse["recipeId"]);
    // recipe card
    $("#recipe_card_holder").append($(
            getRecipeCard(recipeResponse["recipeId"], recipeResponse["recipeName"], recipeResponse["description"], recipeResponse["imgUrl"],
                    RECIPE_CARD_DISPLAY, recipeResponse)));
    // instruction
    $("#instruction_holder").text(recipeResponse["instruction"]);
    // notes
    if (recipeResponse["notes"]) {
        $("#notes_holder").html(recipeResponse["notes"]);
    } else {
        $("#notes_section").hide();
    }
    // uploader
    $("#user_image").attr("src", recipeResponse["uploaderImg"]);
    $("#uploader_name_holder").text(recipeResponse["uploaderName"]);
    if (recipeResponse["modifierId"] != recipeResponse["uploaderId"]) {
        $("#modifier_name_holder").text(recipeResponse["modifierName"]);
        $("#modification_date_text").text("Modification Date: ");
    } else {
        $("#modifier_span").hide();
        $("#modification_date_text").text("Upload Date: ");
    }
    $("#modification_date_holder").text(new Date(recipeResponse["ModifiedDate"]).toGMTString());
    // ingredients
    for (var i = 0; i < recipeResponse["ingredients"].length; i++) {
        $("#ingredient_holder").append($(
                getIngredientLiElement(
                        recipeResponse["ingredients"][i]["name"],
                        recipeResponse["ingredients"][i]["imgUrl"],
                        recipeResponse["ingredients"][i]["amount"])
                ));
    }
    ;
}
;

function getIngredientLiElement(ingredientName, ingredientImg, ingredientAmount) {
    return '' +
            '<li class="w3-padding-16">' +
            '<img src="' + ingredientImg + '" alt="' + ingredientName + '" class="ingredient_list_img w3-left w3-margin-right">' +
            '<span class="w3-large">' + ingredientName + '</span><br>' +
            '<span>' + ingredientAmount + '</span>' +
            '</li>';
}

// get all comments
function getAllTextComments() {
    $(".post_feed").html('');
    var recipeId = sessionStorage.getItem('currentRecipeId');
    var url = '/recipe/' + recipeId + '/comments/text';

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (comments) {
            comments.forEach(function (comment) {
                $('.noComments').addClass('w3-hide');
                if (comment['userName']) {
                    $(".post_feed").append($(populateComments(comment['profilePhoto'], comment['userName'],
                            new Date(comment['createdDate']).toGMTString(), comment['message'])));
                }
            });

            if (comments.length == 0) {
                $('.noComments').removeClass('w3-hide');
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function populateComments(avatar, userName, createdDate, message) {
    return '<div class="w3-container w3-card-2 w3-hover-shadow w3-white w3-round w3-margin">' +
            '<div class="w3-container">' +
            '<img id="postAvatar" src="' + avatar + '" class="w3-circle avatar-style w3-left w3-margin-top" alt="avatar">' +
            '<section class="w3-container w3-left w3-margin-top w3-margin-left">' +
            '<h3>' + userName + '</h3><br>' +
            '<span>Created by <span class="w3-opacity">' + createdDate + '</span></span>' +
            '</section>' +
            '</div>' +
            '<hr>' +
            '<p>' + message + '</p>' +
            '</div>';
}

function postComment() {
    var recipeId = sessionStorage.getItem('currentRecipeId');
    var url = '/recipe/' + recipeId + '/comments';
    var params = {'message': $('#postMsg').val(), "isImage": false};
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        success: function (response) {
            $('#postMsg').val('');
            getAllTextComments();
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function showElement(id) {
    $('#' + id).addClass("w3-show");
    $('#' + id).removeClass("w3-hide");
}

function hideElement(id) {
    $('#' + id).addClass("w3-hide");
    $('#' + id).removeClass("w3-show");
}

function controlComments() {
    if ($('#controlCmds').hasClass("w3-show")) {
        hideElement('controlCmds');
        hideElement('hideIcon');
        showElement('showIcon');
    } else {
        showElement('controlCmds');
        showElement('hideIcon');
        hideElement('showIcon');
    }
}

function viewImage(current, userName, createdDate) {
    $('#expandImg').attr("src", current.src);
    $("#expandImgModal").css("display", "block");
    $('#imdPoster').html(userName);
    $('#imgCreatedDate').html(createdDate);
}

function populateImageCommandsCard(url, userName, createdDate) {
    return '<img id="newImdComment" class="w3-left image_comment w3-card w3-margin"' +
            ' onclick="viewImage(this)" src="' + url + '" alt="uploaded image">';
}

function getAllImgComments() {
    $(".imgComments").html('');
    var recipeId = sessionStorage.getItem('currentRecipeId');
    var url = '/recipe/' + recipeId + '/comments/image';

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (comments) {
            comments.forEach(function (comment) {
                $('.noImages').addClass('w3-hide');
                $(".imgComments").append($(populateImageCommandsCard(comment['message'], comment['userName'],
                        new Date(comment['createdDate']).toGMTString())));
            });

            if (comments.length == 0) {
                $('.noImages').removeClass('w3-hide');
            }
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function postImageComment(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var recipeId = sessionStorage.getItem('currentRecipeId');
            var url = '/recipe/' + recipeId + '/comments';
            var params = {'message': e.target.result, "isImage": true};
            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(params),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + getToken());
                },
                statusCode: {
                    400: function (response) {
                        console.error(response);
                    },
                    401: function (response) {
                        console.error(response);
                    },
                    404: function (response) {
                        console.error(response);
                    },
                    413: function (response) {
                        alert('File size is too large.');
                    }
                },

                success: function (response) {
                    $('#imgComments').val('');
                    getAllImgComments();
                }
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}
