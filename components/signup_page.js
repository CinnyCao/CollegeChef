/* JS functions used to control recipe card */
function signup(){
	
}

function cancel(){
  document.getElementById('register-form').style.display='none';
}

function checkPasswordMatch() {
    var password = $("#pwd").val();
    var confirmPassword = $("#repeated-pwd").val();

    if (password != confirmPassword)
        document.getElementById('repeated-pwd').title = 'Password does not match';
}

$(document).ready(function () {
   $("#repeated-pwd").keyup(checkPasswordMatch);
});