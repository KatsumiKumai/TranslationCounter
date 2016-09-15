var player_group = -1;
var pid = -1;
var num;
var text;
var len =0;
var now_count=0;
var past_count=0;
var change = 0;
var x = -1;
var counter_change = 1;

window.onload = function(){
	document.getElementById("trans_textarea").focus();

	document.onkeydown = function(e){
		if(!e) e = window.event;
	
		if(event.ctrlKey){
			if(e.keyCode == 13){
				t_submit();
				return false;
			}
		}
	}
	login_check();
	load();
	load2();
	load3();
	setInterval("load()", 1000);
	setInterval("load3()", 60000);
}

function load(){
	//console.log("loadします");
	console.log("player_group="+player_group);
	

    $c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=CountTime',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
		//console.log("player_group="+player_group);
	    if(player_group != -1 ){
			if(data.data[0] != null){
				now_count = data.data[0].count;
				if (counter_change == 1) document.getElementById("t_count").value=now_count;
				count = data.data[0].count%num;
				//console.log("num="+num);
				//console.log("now_count="+now_count);
				//console.log("count="+count);
			}else{
			    count = 0;
			}
			x = -count + player_group;
			if(num!=null){
				if(past_count != now_count){
					console.log("カウンターが動きました");
					change ++;
					login_check();
					//load2();
					if(x == 0){
						x = num;
					}else if(x < 0){
					    x = num + x;
					}
					if(x%num == 0){
						document.getElementById('count').style.color = "#FF0000";
					}else if(x%num == 1){
						document.getElementById('count').style.color = "#0000FF";
					}else if(x%num == 2){
						document.getElementById('count').style.color = "#00FF00";
					}else {
						document.getElementById('count').style.color = "#000000";
					}
					if(x == num){
						if(past_count == 0){
							x="しばらくお待ちください";
							document.getElementById('count').style.fontSize = "4em";
							document.getElementById('count').style.lineHeight = "0.9em";
							document.getElementById('trans_submit').disabled = true;
						} else {
							x = "あなたの番です。通訳してください";
							document.getElementById('count').style.fontSize = "4em";
							document.getElementById('count').style.lineHeight = "0.9em";
							if(counter_change != 0){
								document.getElementById('trans_submit').disabled = true;
							}else{
								document.getElementById('trans_submit').disabled = false;
							}
							counter_change = 0;
							//translation();
						}
						document.getElementById('count').innerHTML = x;
					}else if(x == 1){
					    document.getElementById('count').innerHTML = "まもなくあなたの番です（あと"+x+"回）";
						document.getElementById('count').style.fontSize = "4em";
						document.getElementById('count').style.lineHeight = "0.9em";
						if(counter_change != 0){
							document.getElementById('trans_submit').disabled = true;
						}else{
							document.getElementById('trans_submit').disabled = false;
						}
					}else if(x == num-1){
						if(past_count == 0 || change == 2){
							document.getElementById('count').innerHTML = "しばらくお待ちください（あと"+x+"回）";
							document.getElementById('count').style.fontSize = "4em";
							document.getElementById('count').style.lineHeight = "0.9em";
							document.getElementById('trans_submit').disabled = true;
						}else{
							document.getElementById('count').innerHTML = "ここまでの文を通訳して、送信してください";
							document.getElementById('count').style.fontSize = "4em";
							document.getElementById('count').style.lineHeight = "0.9em";
							document.getElementById('count').style.color = "#FF8C00";
							document.getElementById('trans_submit').disabled = false;
						}
					}else{
						document.getElementById('count').innerHTML = "しばらくお待ちください（あと"+x+"回）";
						document.getElementById('count').style.fontSize = "4em";
						document.getElementById('count').style.lineHeight = "0.9em";
						if(counter_change != 0){
							document.getElementById('trans_submit').disabled = true;
						}else{
							document.getElementById('trans_submit').disabled = false;
						}
					}
					past_count = now_count;
				}
			}
		} else if(player_group == -1 || player_group == null){
			document.getElementById('count').innerHTML = "<a href='http://www.u.tsukuba.ac.jp/~s1620622/counter_exp2/participation.html'>参加登録してください</a>";
			document.getElementById('count').style.fontSize = "1.4em";
			document.getElementById('count').style.lineHeight = "0.5em";
			document.getElementById('count').style.color = "#000000";
			document.getElementById('trans_submit').disabled = true;
		}
	}
    });

}

function load2(){
    text = "";
    text += "<ul>";
    $c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=Translation',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
		if(data.data[0] != null){
			//translationテーブルをt_countで昇順ソート
		    data.data.sort(
			function(a,b){
			    var aCount = a.t_count;
			    var bCount = b.t_count;
			    if( aCount < bCount) return -1;
			    if( aCount > bCount) return 1;
			    return 0;
			}
		    );

			//入力文をhtmlで形成する
			//最高点の計算
			var i=0;
			len = data.data.length;
			//console.log(data);
			while(i < len){
				var j = i;
				var t = 0;
				var tmp_text = [];
				var tmp_id = [];
				var best_score = -1000;
				//console.log("i="+i+"j="+j);
	 			while(data.data[i].t_count == data.data[j].t_count){
					if(best_score < data.data[j].score){
						best_score = data.data[j].score;
					}
					j++;
					if(j>=len){
						break;
					}
				}
				
				//t_countごとにまとめる
				j = i;
				while(data.data[i].t_count == data.data[j].t_count){
					if(best_score <= data.data[j].score){
						tmp_text[t] = data.data[j].result;
						tmp_id[t] = data.data[j].id;
						t++;
					}
					j++;
					if(j>=len){
						break;
					}
				}
		
				text += "<li>"+tmp_text[0]+"</li>";
				i = j;
			}

		    text += "</ul>";

			document.getElementById('translationText').innerHTML = text;
		}
	}
    });

	var huga = 0;
	var hoge = setInterval(function() {
					    //console.log(huga);
					    huga++;
					    //終了条件
						if (huga == 5) {
					    	clearInterval(hoge);
							// 現在の縦スクロール位置
							var scrollPosition = document.getElementById('translationText').scrollTop;
							// スクロール要素の高さ
							var scrollHeight = document.getElementById('translationText').scrollHeight;
							document.getElementById('translationText').scrollTop = scrollHeight;
					    }
					}, 100);

}

function load3(){
	 $c4u.ajax({
		type: "GET",
		url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=IntervalTranslation',
		dataType: "json",
		xhrFields:{withCredentials: true},
		crossDomain: true,
		cache: false,
		success:function(data){
			if(data.data[0] != null){
		    	num = data.data[0].num;
			}
		}
    });
}


function update(id,trans_group){
	console.log("get_id="+id);
	var trans_id = id;
	var trans_group = trans_group;
	var score = 100;
	var trans_sets = 1;
	var clickMe = document.getElementById("update");

	$c4u.ajax({
		  type:"post",
		  url:"http://crowd4u.org/api/insert_fact",
		  data:"project_name=Translation_Sign_Language_Counter2_0714&relation_name=OpenNow_TransGroup&tuple=trans_group:"+trans_group,
		  xhrFields:{withCredentials: true},
		  crossDomain: true,
		  cache: false,
		  success: function(data){
		    $c4u(document).ajaxComplete(function() {
		      //insert_fact();
		    });
		  }
	});


	//chickMe.click();
	if( /*@cc_on ! @*/ false )
	{
  		// IEの場合
		var huga = 0;
		var hoge = setInterval(function() {
		    //console.log(huga);
		    huga++;
		    //終了条件
		    if (huga == 7) {
			    clearInterval(hoge);
				clickMe.fireEvent("onclick"); //これでclickイベントが発火する
			    //console.log("終わり");
			   }
		}, 100);
	} else {
		// それ以外の場合
		var huga = 0;
		var hoge = setInterval(function() {
		    //console.log(huga);
		    huga++;
		    //終了条件
		    if (huga == 7) {
		    clearInterval(hoge);
			var event = document.createEvent( "MouseEvents" ); // イベントオブジェクトを作成
		 	event.initEvent("click", false, true); // イベントの内容を設定
		 	clickMe.dispatchEvent(event); // イベントを発火させる
		    //console.log("終わり");
		    }
		}, 100);
	}
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

	//参加登録しているかの確認
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
			    document.getElementById("groupid").value=player_group;
			} else {
				player_group = -1;
		    }
		}
	});

	$c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=CountTime',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
		if(data.data[0] != null){
			document.getElementById("t_count").value=data.data[0].count;
		}else{
			document.getElementById("t_count").value=-1;
		}
	}
    });

	
}

function t_submit(){
		var clickMe = document.getElementById("trans_submit");
		//chickMe.click();
		if( /*@cc_on ! @*/ false ){
			// IEの場合
			clickMe.fireEvent("onclick"); //これでclickイベントが発火する
		} else {
			// それ以外の場合
			var event = document.createEvent( "MouseEvents" ); // イベントオブジェクトを作成
			event.initEvent("click", false, true); // イベントの内容を設定
			clickMe.dispatchEvent(event); // イベントを発火させる
		}

		if (clickMe.disabled == false) alert("ありがとうございました");
}