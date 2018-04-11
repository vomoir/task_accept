$(document).ready(function () {
	//var taskName = getUrlParameter('taskname');
	var year = getParameterByName('year');
	var taskName = getParameterByName("taskname");
	$("#taskName").html(taskName);
	$("#schoolyear").html(year);
});
function update_user(){
	firstname = $("#firstName").val();
	lastname = $("#lastName").val();
	var year = getParameterByName('year');
	var taskName = getParameterByName("taskname");
	
	window.location = './index.php?year=' + year + '&taskname=' + taskName + '&studentname=' + firstname + ' ' + lastname;	
}
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//http://dummy.com/?technology=jquery&blog=jquerybyexample.

