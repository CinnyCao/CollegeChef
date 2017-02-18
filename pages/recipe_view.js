$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');

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
