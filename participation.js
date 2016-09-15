var player_group = -1;
var pid = -1;

window.onload = function(){
	// ボタンを取得
	targetBtn = document.getElementById("ptask");

	// targetBtnをクリックしたとき
	targetBtn.onclick = function(){

		var clickMe = document.getElementById("participation");
				//chickMe.click();
				if( /*@cc_on ! @*/ false )
				{
  					// IEの場合
					clickMe.fireEvent("onclick"); //これでclickイベントが発火する
				}
				else
				{
					 // それ以外の場合
					 var event = document.createEvent( "MouseEvents" ); // イベントオブジェクトを作成
					 event.initEvent("click", false, true); // イベントの内容を設定
					 clickMe.dispatchEvent(event); // イベントを発火させる
				}
	}
	
	setInterval("load()", 1000);
}

function load(){
	console.log("load");

	
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

	if(pid == -1){
		document.getElementById('login').innerHTML = "<a href='http://crowd4u.org' target='_blank'>ログインしてください</a>"
		targetBtn.disabled = true;
		targetBtn.id = "ptask2"
	} else {
		targetBtn.disabled = false;
		targetBtn.id = "ptask"
		document.getElementById('login').innerHTML = pid+"はCrowd4Uにログインしています";
	}

    
	$c4u.ajax({
	    type: "GET",
	    url: 'http://crowd4u.org/api/get_data_filtering_userid?project_name=Translation_Sign_Language_Counter2_0714&relation_name=PlayerGroup&attr=pid',
	    dataType: "json",
	    xhrFields:{withCredentials: true},
	    crossDomain: true,
	    cache: false,
	    success:function(data){
			if(data.data[0] != null){
			    player_group = data.data[0].groupid;
			} else {
				player_group = -1;
		    }
		}
	});

	if(pid == -1){
		document.getElementById('count').innerHTML =　"ログインしてください";
	} else {
		if(player_group == -1 || player_group == null){
			document.getElementById('count').innerHTML =　"参加登録をしてください";
	    } else {
			document.getElementById('count').innerHTML = "<a href='http://crowd4u.org/view/635/TranslationTask'>通訳画面に移動してください</a>";
		}	
	}
}
