var text;
var len =0;
var prelen=-1;
var now_count=0;
var past_count=0;

function load(){
	//console.log("loadします");
    $c4u.ajax({
	type: "GET",
	url: 'http://crowd4u.org/api/relation_data?project_name=Translation_Sign_Language_Counter2_0714&relation_name=CountTime',
	dataType: "json",
	xhrFields:{withCredentials: true},
	crossDomain: true,
	cache: false,
	success:function(data){
			if(data.data[0] != null){
				now_count = data.data[0].count;
			}
			if(past_count != now_count){
				console.log("カウンターが動きました");
				load2();
				load3();
				past_count = now_count;
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
	
			text += "<li><input class='microtask' type='button' value='他の候補をみる' onClick='update("+tmp_id[0] +","+data.data[i].t_count+")' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+tmp_text[0]+"</li>";
			i = j;
		}

	    text += "</ul>";

		document.getElementById('translationText').innerHTML = text;
	}
    });
}

function load3(){
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

function update(id,trans_group){
	//console.log("get_id="+id);
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
		   // console.log(huga);
		    huga++;
		    //終了条件
		    if (huga == 6) {
			    clearInterval(hoge);
				clickMe.fireEvent("onclick"); //これでclickイベントが発火する
			   // console.log("終わり");
			   }
		}, 100);
	} else {
		// それ以外の場合
		var huga = 0;
		var hoge = setInterval(function() {
		    //console.log(huga);
		    huga++;
		    //終了条件
		    if (huga == 6) {
		    clearInterval(hoge);
			var event = document.createEvent( "MouseEvents" ); // イベントオブジェクトを作成
		 	event.initEvent("click", false, true); // イベントの内容を設定
		 	clickMe.dispatchEvent(event); // イベントを発火させる
		    //console.log("終わり");
		    }
		}, 100);
	}
}

window.onload = function(){
	load();
    setInterval("load()", 1000);
}
