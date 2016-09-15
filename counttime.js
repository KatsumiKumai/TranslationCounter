var num = 0;
var name = "カウント";
var targetBtn;
var url;
var new_url;

window.onload = function(){
	// ボタンを取得
	targetBtn = document.getElementById("count");

	// 初期設定
	targetBtn.value = name + num;

	document.onkeydown = function(e){
		if(!e) e = window.event;
	
		if(e.keyCode == 65){
			post_time();
		}
	}

}

function post_time(){
	num++;
	console.log("プラスしました"+num);
	targetBtn.value = name + num;
		
	//ボタンを押した時間をtimeテーブルに格納
	url = $c4u("form.crowd4u").attr("action");
	new_url = url;

	$c4u.ajax({
		type:"post",
		url:"http://crowd4u.org/api/insert_time",
		data:"project_name=Translation_Sign_Language_Counter2_0714",
		xhrFields:{withCredentials: true},
		crossDomain: true,
		cache: false,
		success: function(data){
			$c4u(document).ajaxComplete(function() {
				insert_time();
			});
		}
	});

	function insert_time(eo){
		new_url = $c4u("form.crowd4u").attr("action"); 
		if( new_url != url){
			url = new_url;
		    $c4u.ajax({
		      type:"post",
		      url:"http://crowd4u.org/api/insert_time",
		      data:"Translation_Sign_Language_Counter2_0714",
			  xhrFields:{withCredentials: true},
			  crossDomain: true,
			  cache: false
		    });
		 }
	}
}
