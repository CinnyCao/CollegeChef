$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');
    //load footer
    $('#footer_holder').load('/components/footer.html');

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
    $('.half-or-third').removeClass('w3-third');
    $('.half-or-third').addClass('w3-half');
    // Hide users list section for users
    $('#users-tab').hide();
}

function threeTab() {
    $('.half-or-third').removeClass('w3-half');
    $('.half-or-third').addClass('w3-third');
    // Show users list section for Admin
    $('#users-tab').show();
}

// save the result of notification settings
function saveNotificationSetting(){
    // todo
}

function deleteUser(){
    // todo
}