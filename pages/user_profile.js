$(function() {
    //load navbar
    $('#navbar_holder').load('/components/navbar.html');
    //load footer
    $('#footer_holder').load('/components/footer.html');
});

// Accordion  will change later!!!!!!!!!!!!
function openList(listId) {
    var x = document.getElementById(listId);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function displayAndHidPage(id){
    document.getElementById(id).style.display='block';
    document.getElementById(id).siblings.style.display='none';
}

// delete later
function hide(id){
  document.getElementById(id).style.display='none';
}

function show(id){
  document.getElementById(id).style.display='block';
}