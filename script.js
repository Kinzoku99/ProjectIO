document.getElementById("contact").onclick = function() {
    var myAlert = document.getElementById('liveToast');
    var bsAlert = new bootstrap.Toast(myAlert);
    bsAlert.show();
};

document.getElementById("sources").onclick = function() {
    var myAlert = document.getElementById('liveToast2');
    var bsAlert = new bootstrap.Toast(myAlert);
    bsAlert.show();
};