var num = 0;
var name = "カウント";
var targetBtn;
var pid = -1;
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

	var date_obj = new Date();

	// 1970/01/01 00:00:00 から開始して経過した時間を取得
	now = date_obj.getTime();
	worker_time =GetTimeString(now);

	//ボタンを押した時間をtimeテーブルに格納
	$c4u.ajax({
		  type:"post",
		  url:"http://crowd4u.org/api/insert_fact",
		  data:"project_name=CounterCheck0927&relation_name=Worker_Time&tuple=player:"+pid+",time:"+worker_time,
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
	    url: 'http://crowd4u.org/api/get_data_filtering_userid?project_name=CounterCheck0927&relation_name=_Member&attr=_member_id',
	    dataType: "json",
	    xhrFields:{withCredentials: true},
	    crossDomain: true,
	    cache: false,
	    success:function(data){
			if(data.data[0] != null){
			    pid = data.data[0]._member_id;	
			    if(pid == -1){
			    	alert("ログインしてください")
			    	 location.href = "http://crowd4u.org/";
			    }
			}
	    }
	});
}

function GetTimeString(time){
   var milli_sec = time % 1000;
   time = (time - milli_sec) / 1000;
   var sec = time % 60;
   time = (time - sec) / 60;
   var min = time % 60;
   var hou = (time - min) / 60;

   // 文字列として連結
   return hou  + "時間" +
      ((min < 10) ? "0" : "") + min + "分" +
      ((sec < 10) ? "0" : "") + sec + "秒" +
      ((milli_sec < 100) ? "0" : "") + ((milli_sec < 10) ? "0" : "") + milli_sec;
}

