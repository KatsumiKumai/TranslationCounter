var num = 0;
var name = "カウント";
var targetBtn;
var pid = -1;
var date_obj = new Date();
var worker_time;

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

	//ログインチェック
	login_check();

}

function post_time(){
	num++;
	console.log("プラスしました"+num);
	targetBtn.value = name + num;

	worker_time = date_obj.toString();
		
	//ボタンを押した時間をtimeテーブルに格納
	$c4u.ajax({
		  type:"post",
		  url:"http://crowd4u.org/api/insert_fact",
		  data:"project_name=Translation_Sign_Language_Counter2_0714&relation_name=Worker_Time&tuple=player:"+pid,
		  xhrFields:{withCredentials: true},
		  crossDomain: true,
		  cache: false,
		  success: function(data){
		    $c4u(document).ajaxComplete(function() {
		      //insert_fact();
		    });
		  }
	});

	console.log("pid="+pid);
	console.log("worker_time="+worker_time);
}


function login_check(){
	//oahuにログインしてるか確認
	$c4u.ajax({
	    type: "GET",
	    url: 'http://crowd4u.org/api/get_data_filtering_userid?project_name=Translation_Sign_Language_Counter2_0714&relation_name=_Member&attr=_member_id',
	    dataType: "json",
	    xhrFields:{withCredentials: true},
	    crossDomain: true,
	    cache: false,
	    success:function(data){
		if(data.data[0] != null){
		    pid = data.data[0]._member_id;	
		}
	    }
	});
}

