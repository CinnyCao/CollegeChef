$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html', function () {
        onNavBarLoaded();
    });

    // get recipe data
    fetchRecipeDetail();

    /* Button listener for text post */
    $('.input_button').on('click', function(){
        text = $('.input_text').val();
        if (text != undefined) {
            post = createPost(text);
            new_post = $('.post_feed').append($(post));
            hideEmptyMsg();
            changeCommentSize();
        }
    });

    /* Button listener for photo post */
    $('.photo_button').on('click', function () {
        photo_url = $('.photo_url').val();
        if (photo_url != undefined) {
            photo = '<img src="' + photo_url + '">'
            post = createPost(photo);
            new_post = $('.post_feed').append($(post));
            hideEmptyMsg();
            changeCommentSize();
        }
    });

    $(window).on('resize', function () {
        changeCommentSize();
    });
});

function fetchRecipeDetail() {
    $.ajax({
        type : "GET",
        url : "/recipe/" + getUrlParameter("id"),
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success : function (recipeResponse) {
            console.log(recipeResponse);
            if (getUserType() == null) {
                recipeResponse["hasFavorited"] = false;
                loadRecipeDetail(recipeResponse);
            } else {
                recipeResponse["hasFavorited"] = true;
                // get is favorited
                $.ajax({
                    type : "GET",
                    url : "/recipe/" + getUrlParameter("id") + "/favorite",
                    dataType : "json",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + getToken());
                    },
                    success : function (favoriteResponse) {
                        recipeResponse["isFavorited"] = favoriteResponse["isFavorited"];
                        loadRecipeDetail(recipeResponse);
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
    // recipe card
    $("#recipe_card_holder").append($(
        getRecipeCard(recipeResponse["recipeId"], recipeResponse["recipeName"], recipeResponse["description"], recipeResponse["imgUrl"],
            RECIPE_CARD_DISPLAY, recipeResponse)));
    // instruction
    $("#instruction_holder").text(recipeResponse["instruction"]);
    // notes
    if (recipeResponse["notes"]) {
        $("#notes_holder").text(recipeResponse["notes"]);
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
    for (var i=0; i<recipeResponse["ingredients"].length; i++) {
        $("#ingredient_holder").append($(
            getIngredientLiElement(
                recipeResponse["ingredients"][i]["name"],
                recipeResponse["ingredients"][i]["imgUrl"],
                recipeResponse["ingredients"][i]["amount"])
        ));
    }
}

function getIngredientLiElement(ingredientName, ingredientImg, ingredientAmount) {
    return '' +
        '<li class="w3-padding-16">' +
        '<img src="' + ingredientImg + '" alt="' + ingredientName + '" class="ingredient_list_img w3-left w3-margin-right">' +
        '<span class="w3-large">' + ingredientName + '</span><br>' +
        '<span>' + ingredientAmount + '</span>' +
        '</li>';
}

function changeCommentSize() {
    $('.post_content').height($('.post').width());
}

function getNextPostId() {
    return $('.post').length + 1;
}

function createPost(content) {
    id = getNextPostId();
    return '' +
        '<div class="post">' +
            '<div class="post_content">' + content + '</div>' +
            '<div class="post_second_row">' +
                '<img class="post_like" src="/img/like_button.jpg" alt="Like" onclick="doLike('+ id +')">' +
                '<p class="post_count">x<span id="count_' + id + '" class="test--like_count">0</span></p>' +
        '</div></div>';
}

function doLike(id) {
    $('#count_' + id).text(Number($('#count_' + id).text()) + 1);
}

function hideEmptyMsg() {
    // Hide empty feed msg when first has been added
    if (getNextPostId() == 2) {
        $('#empty_feed_msg').hide();
    }
}
