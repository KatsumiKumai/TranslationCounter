function load(){
	$c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=IntervalTranslation',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
    	document.getElementById('player_num').innerHTML = data.data[0].num;
	}
	});

	$c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=IntervalSec',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
    	document.getElementById('sec').innerHTML = data.data[0].sec;
	}
	});
}

window.onload = function(){
	load();
    //setInterval("load()", 3000);
}