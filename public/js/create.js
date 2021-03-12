var url = location.pathname.split('/')[3];
$(document).ready(function(){
	$('#dashboard').attr('href','/farmer/'+url);
	$('#create').attr('href','/farmer/'+'create/'+url);
	$('#owner').attr('value',url);
});