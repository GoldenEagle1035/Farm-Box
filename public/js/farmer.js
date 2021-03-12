var url = location.pathname.split('/')[2];
var username = url.replace(/-/g,' ');
var farmId = $('#farms');
function displayFarm(farm){
	var name = ' '+farm.name; var type = farm.type; var price = farm.price;
	var contractPeriod = ' Contract Period: '+ farm.contractPeriod + ' month(s)'; 
	var harvestPeriod = ' Harvest Period: ' + farm.harvestPeriod + ' month(s)';
	var capacity = ' '+farm.capacity+' units'; 
	var noHarvested = ' ' + farm.noHarvested + name + ' Units Harvested'; 
	var ret = ' Expected Return: ' + farm.return +'% per ' + farm.contractPeriod + ' month(s)';
	var image = farm.image; var icon; var iconImg = $('<img>'); var owner = ' Owner: '+farm.owner;
	var img = $('<img>').attr('alt',name).css('height','200px').css('width','306px');
	if(!farm.hasOwnProperty("image")){
		img.attr('src','/img/farm/farm.jpg');
	}
	else{
		img.attr('src',image);
	};
	var li = $('<li></li>').attr('class','one_third');
	var article = $('<article></article>').attr('class','element'); var div = $('<div></div>').attr('class','excerpt');
	var priceIcon = $('<img>').attr('src','/img/icons/naira.png').css('height','20px').css('width','20px');
	var calender = $('<i></i>').attr('class','fa fa-calendar'); 
	var basket = $('<i></i>').attr('class','fa fa-shopping-basket'); 
	var money = $('<i></i>').attr('class','fa fa-money'); 
	var time = $('<i></i>').attr('class','fa fa-clock-o');
	var user = $('<i></i>').attr('class','fa fa-user');
	var p = $('<p></p>'); var p5 = $('<p></p>'); var heading = $('<h6></h6>').attr('class','heading');
	var p1 = $('<p></p>'); var p2 = $('<p></p>'); var p3 = $('<p></p>'); var p4 = $('<p></p>');
	if(type == 'poultry'){
		icon = '/img/icons/poultry.png';
	}
	else if (type == 'cocoa'){
		icon = '/img/icons/cocoa.png';	
	}
	else if(type == 'cattle'){
		icon = '/img/icons/cattle.png';	
	}
	else{
		icon = '/img/icons/rice.png';		
	}
	iconImg.attr('src',icon).css('height','20px').css('width','20px');
	heading.append(priceIcon).append(price).append(name);
	p.append(iconImg).append(capacity);
	p1.append(calender).append(contractPeriod);
	p2.append(basket).append(noHarvested);
	p3.append(money).append(ret);
	p4.append(time).append(harvestPeriod);
	p5.append(user).append(owner);
	div.append(heading).append(p).append(p1).append(p2).append(p3).append(p4).append(p5);
	li.append(img).append(div);
	farmId.append(li);
} 
$(document).ready(function(){
	$('#dashboard').attr('href','/farmer/'+url);
	$('#create').attr('href','/farmer/'+'create/'+url);
	$.ajax({
		type: 'GET',
		url: 'viewfarms/'+username,
		success: function(farms){
			for(var farm in farms){
				displayFarm(farms[farm]);
			}
		}
	});
});