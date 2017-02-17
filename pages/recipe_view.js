$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');

    // make ingredient search bar wider on medium screen
});

$(function(){
    /* Show page content if Javascript is enabled */
    $('.my_content').css('display', 'block');

    /* Find nav height and leave space for it */
    resizeNavSpace();
    $(window).on('resize', function () {
        if ($('.my_content').width() >= 480) {
            $('.logo').css('display', 'block');
        }
        resizeNavSpace();
    });

    /* Hide logo when scroll down */
    $(window).scroll(function () {
        if ($('.my_content').width() < 480) {
            // find the scroll position after scroll
            if ($('body').scrollTop() >= $('.logo').height()) {
                $('.logo').css('display', 'none');
            } else {
                $('.logo').css('display', 'block');
                // calculate new nav height when logo is shown
                resizeNavSpace();
            }
        }
    })

    /* Button listener for go to Previous cover photo button */
    $('#previous_button').on('click', function () {
        // Find the current displaying cover photo
        currPhoto = $('.current_cover-photo');
        // Find the data-order of the to be displayed photo
        prevId = currPhoto.data('order') - 1;
        if (prevId == 0) {
            prevId = $('.profile_cover-photo').length;
        }

        // Mark current displaying photo as not displaying
        currPhoto.removeClass('current_cover-photo');
        // Set to be displayed photo as current displaying
        $('img[data-order="' + prevId + '"]').addClass('current_cover-photo');
        $(window).scrollTop($('.cover-photo_section').offset().top - $('.nav_anchor_ul').height());
    });

    /* Button listener for go to Next cover photo button */
    $('#next_button').on('click', function () {
        // Find the current displaying cover photo
        currPhoto = $('.current_cover-photo');
        // Find the data-order of the to be displayed photo
        nextId = currPhoto.data('order') + 1;
        if (nextId > $('.profile_cover-photo').length) {
            nextId = 1;
        }

        // Mark current displaying photo as not displaying
        currPhoto.removeClass('current_cover-photo');
        // Set to be displayed photo as current displaying
        $('img[data-order="' + nextId + '"]').addClass('current_cover-photo');
        $(window).scrollTop($('.cover-photo_section').offset().top - $('.nav_anchor_ul').height());
    });

    /* Button listener for text post */
    $('.input_button').on('click', function(){
        text = $('.input_text').val();
        if (text != undefined) {
            post = createPost(text);
            new_post = $('.post_feed').append($(post));
            hideEmptyMsg();
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
        }
    });
});

function getNextPostId() {
    return $('.post').length + 1;
}

function createPost(content) {
    id = getNextPostId();
    time = new Date($.now()).toLocaleString();
    return '' +
        '<div class="post test--post">' +
            '<div class="post_name_tag">' +
                '<img class="test--profile_photo" src="./img/profile_picture.jpg" alt="photo">' +
                '<p class="test--profile_name">User Name</p>' +
            '</div>' +
            '<div class="post_content test--post_content">' + content + '</div>' +
            '<div class="post_second_row">' +
                '<p class="post_time">' + time + '</p>' +
                '<img class="post_like" src="img/like_button.jpg" alt="Like" onclick="doLike('+ id +')">' +
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

function resizeNavSpace() {
    $('.my_content').css('padding-top', $('.nav').height());
}

function gotoAboutNyan() {
    if ($('.my_content').width() < 480) {
        $(window).scrollTop($('#profile_info').offset().top - $('.nav_anchor_ul').height());
    } else {
        $(window).scrollTop($('#profile_info').offset().top - $('.nav_anchor_ul').height() + 2);
    }
}

function gotoFeed() {
    $(window).scrollTop($('#feed').offset().top - $('.nav_anchor_ul').height());
}
