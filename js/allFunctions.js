//變數宣告
_currentUser = null;

//設定字幕位置
_englishSub = "./upload/english.vtt";
_chineseSub = "./upload/chinese.vtt";

//設定影片位置
_videoURL = "./upload/video.mp4";

//是否使用討論區
_forum = false;

if (_forum == true) {
  $("#_forum").show();
  $("#message_content").show();
} else {
  $("#_forum").hide();
  $("#message_content").hide();
}
//是否使用測驗
_exam = true;

if (_exam == true) {
  $("#exam_content").show();
} else {
  $("#exam_content").hide();
}

//設定所見所得編輯器
CKEDITOR.replace("message_box");
//讀取撥放器
_player = $("video").get(0);
//影片時間更新
_maxPlaytime = 0;

//學習倒數時間 FLAG
_countdownFlag = 0;
//學習

//UI設定 隱藏留言頁面與登出按鈕
$("#message").fadeOut(100);
$("#message_content").fadeOut(100);
$("#exam_content").fadeOut(100);
$("#reward_content").fadeOut(100);
$("#logout_link").hide();
/******************************登入與登出功能******************************/
function login() {
  //先進行Session確認，若成功登入則data回傳帳號名稱，並將該次登入的帳號存入全域變數中
  $.post("./php/login.php", function(data) {
    if (data != "fail") {
      //登入成功，顯示歡迎資訊並顯示登出按鈕
      _currentUser = data;
      $("#home").html("歡迎 " + data + " 使用本系統");
      $("#message_info").html("正以 " + data + " 身分留言<br/>");
      $("#logout_link").show();
      $("#message_form").show();
      $("#message_past").show();

      //載入影片
      _player.src = _videoURL;
      _player.load();
      _player.volume = 0.5;
      $("#volumeInfo").html(_player.volume * 100);
      _player.playbackRate = 1;
      $("#speedInfo").html("x" + _player.playbackRate);

      /*20200107 加入TIMER開始計時以便進行測驗跳轉，這邊是中途離開載回來的，要注意TIMER不能從頭算起**/

      /*20200107 加入TIMER開始計時以便進行測驗跳轉**/

      //載入貼文、單字與時間標記
      loadPost();
      loadTimeTag();
      loadVocabularyTag();
      userLog(_currentUser, "reLogin", _videoURL, "homePage");
    } else {
      //第一次進入網站時顯示帳號密碼輸入框，並不提供留言功能
      $("#home").html(
        "<form id='login_data'>帳號：<div class='ui input' id='account'><input type='text' id='account' name='account' placeholder='帳號...'/></div>　密碼：<div class='ui input' id='password'><input type='password' id='password' name='password' placeholder='密碼...'/></div>　<button type='button' id='login_button' class='mini ui button'>登入</button></form>"
      );
      $("#message_info").html("登入後才能留言喔");
      //隱藏留言功能
      $("#message_form").hide();
      $("#message_past").hide();
      //按下登入按鈕後進行資料確認，不可輸入空值
      $("#login_button").click(function() {
        var account = $("input#account").val();
        var password = $("input#password").val();

        if (account == "" || password == "") {
          alert("請檢查是否輸入帳號或密碼");
        } else {
          //輸入帳號密碼後進行資料驗證
          $.post("./php/login.php", $("#login_data").serialize(), function(
            msg
          ) {
            if (msg != "fail") {
              //登入成功，顯示歡迎資訊並顯示登出按鈕，並將該次登入的帳號存入全域變數中
              $("#home").html("歡迎 " + msg + " 使用本系統");
              $("#message_info").html("正以 " + msg + " 身分留言<br/>");
              $("#logout_link").show();
              $("#message_form").show();
              $("#message_past").show();
              _currentUser = msg;

              //載入影片
              _player.src = _videoURL;
              _player.load();
              _player.volume = 0.5;
              $("#volumeInfo").html(_player.volume * 100);
              _player.playbackRate = 1;
              $("#speedInfo").html("x" + _player.playbackRate);

              /*20200107 加入TIMER開始計時以便進行測驗跳轉，這邊是一開始的登入**/
              /*20200107 加入TIMER開始計時以便進行測驗跳轉**/
              //載入貼文、單字與時間標記
              loadPost();
              loadTimeTag();
              loadVocabularyTag();
              userLog(_currentUser, "login", _videoURL, "homePage");
            } else {
              //登入失敗，顯示警告訊息
              alert("登入失敗，請確認是否輸入錯誤或尚未註冊");
            }
          });
        }
      });
    }
  });
}

$("#logout_link").click(function() {
  //登出功能
  var _logoutConfirm = confirm("確定要登出嗎？"); //確認是否登出

  if (_logoutConfirm == true) {
    userLog(_currentUser, "logout", _videoURL, "homePage");
    //確認登出
    $.post("./php/logout.php");
    //重整頁面
    location.reload();
  }
});

/******************************讀取資料功能******************************/
function loadTimeTag() {
  //讀取時間標記
  $("#tag_select").empty(); //清空原本的下拉選單
  //將TAG寫入下拉選單中
  $.post("./php/loadTimetag.php", function(msg) {
    if (msg) {
      var _timeTagArray = msg.slice(0, -1).split(",");
      for (i = 0; i < _timeTagArray.length; i++) {
        $("#tag_select").append(
          $("<option></option>")
            .attr("value", _timeTagArray[i])
            .text(formatSecond(_timeTagArray[i]))
        );
      }
    }
  });
}

function loadVocabularyTag() {
  //讀取單字標記
  $("#word_select").empty(); //清空原本的下拉選單
  //將TAG寫入下拉選單中
  $.post("./php/loadVocabulary.php", function(msg) {
    if (msg) {
      var _vocabularyTagArray = msg.slice(0, -1).split(",");

      //tagArray[i]表示單字,tagArray[j]表示時間
      for (i = 0, j = 1; i < _vocabularyTagArray.length; i += 2, j += 2) {
        $("#word_select").append(
          $("<option></option>")
            .text(
              _vocabularyTagArray[i] +
                "(" +
                formatSecond(_vocabularyTagArray[j]) +
                ")"
            )
            .attr({
              id: _vocabularyTagArray[j],
              value: _vocabularyTagArray[i]
            })
        );
      }
    }
  });
}

/******************************時間處理功能******************************/
function formatSecond(_seconds) {
  //將秒數轉為時分秒格式
  var _hour = Math.floor(_seconds / 3600);
  var _minute = Math.floor((_seconds - _hour * 3600) / 60);
  var _second = parseInt(_seconds - _hour * 3600 - _minute * 60);

  while (_minute.length < 2) {
    _minute = "0" + _minute;
  }
  while (_second.length < 2) {
    _second = "0" + _minute;
  }
  if (_hour) _hour += "時";
  return _hour + _minute + "分" + _second + "秒";
}

/******************************字幕處理功能******************************/
//英文字幕
function subtitle_english(_time) {
  _time = parseInt(_time);
  var requestEnglish = new XMLHttpRequest();
  requestEnglish.open("GET", _englishSub, true);
  requestEnglish.responseType = "text";
  requestEnglish.onload = function() {
    //取得英文字幕文本
    var _textEnglish = requestEnglish.response;
    //將字幕分行儲存
    $("#view_english").text("");

    _textEnglish = _textEnglish.split("\n\n");
    _textEnglish = _textEnglish[2].split("\n");

    _textEnglish.map(function(parts) {
      _english = parts.split(",");

      //處理時間部分
      if (_english.includes("Dialogue: 0") == true) {
        var _startTime = _english[1];
        if (typeof _startTime == "string") {
          _startTime = _startTime.split(":");
          var _timeEnglish =
            parseInt(_startTime[0]) * 60 +
            parseInt(_startTime[1]) * 60 +
            parseInt(_startTime[2]);
        }
      }

      //處理文字部分
      var _subEnglish = _english[9];
      _subEnglish = String(_subEnglish).split(" ");

      if (_timeEnglish > _time - 5 && _timeEnglish < _time + 5) {
        $("#view_english").append(
          "<span style='font-size:18px; color:#191970;'>" +
            formatSecond(_timeEnglish) +
            ":</span>"
        );

        for (i = 0; i < _subEnglish.length; i++) {
          $("#view_english").append(
            "<span id='" +
              _timeEnglish +
              "' class='word_english' style='font-size:18px;'>" +
              _subEnglish[i] +
              "</span> "
          );
        }

        $("#view_english").append("<br/>");
      }
    });

    //滑過單字
    $("span.word_english").mouseenter(function() {
      $(this).css("cursor", "pointer");
      $(this).css("background-color", "red");
    });

    $("span.word_english").mouseleave(function() {
      $(this).css("cursor", "pointer");
      $(this).css("background-color", "transparent");
    });

    //新增單字
    $("span.word_english").click(function() {
      _selectedWord = $(this)
        .text()
        .replace(
          /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\「|\」|\,|\<|\.|\>|\/|\?]/g,
          ""
        );
      _selectedTime = this.id;

      //如果有登入，處理資料
      if (_currentUser) {
        _tagData = {
          account: _currentUser,
          vocabulary: _selectedWord,
          time: _selectedTime,
          action: "add"
        };
        $.post("./php/tagVocabulary.php", _tagData, function(msg) {
          if (msg == "success") {
            loadVocabularyTag();
            userLog(
              _currentUser,
              "tagVocabulary",
              _videoURL,
              _selectedWord + "(" + formatSecond(_selectedTime) + ")"
            );
          }
        });
      } else {
        console.log("未登入");
      }
    });
  };
  requestEnglish.send();
}

//中文
function subtitle_chinese(_time) {
  _time = parseInt(_time);
  var requestChinese = new XMLHttpRequest();
  requestChinese.open("GET", _chineseSub, true);
  requestChinese.responseType = "text";
  requestChinese.onload = function() {
    //取得中文字幕文本
    var _textChinese = requestChinese.response;

    //將字幕分行儲存
    $("#view_chinese").text("");

    _textChinese = _textChinese.split("\n\n");
    _textChinese = _textChinese[2].split("\n");

    _textChinese.map(function(parts) {
      _chineseContent = parts.split(",");

      //處理時間部分
      if (_chineseContent.includes("Dialogue: 0") == true) {
        var _startTime = _chineseContent[1];

        if (typeof _startTime == "string") {
          _startTime = _startTime.split(":");
          var _timeChinese =
            parseInt(_startTime[0]) * 60 +
            parseInt(_startTime[1]) * 60 +
            parseInt(_startTime[2]);
        }
      }

      //處理文字部分
      var _subChinese = _chineseContent[9];
      _subChinese = String(_subChinese).split(" ");

      if (_timeChinese > _time - 5 && _timeChinese < _time + 5) {
        $("#view_chinese").append(
          '<span style="font-size:18px; color:#191970;">' +
            formatSecond(_timeChinese) +
            ":</span>"
        );
        $("#view_chinese").append(
          '<span id="' +
            _timeChinese +
            '" class="word_chinese" style="font-size:18px;">' +
            _subChinese +
            " " +
            "</span>"
        );
        $("#view_chinese").append("<br/>");
      }
    });
  };
  requestChinese.send();
}

/******************************單字查詢功能******************************/
function dictionarySearch(_searchWord, _searchTime) {
  //單字查詢
  var _search = {
    vocabulary: _searchWord
  };

  if (_currentUser) {
    $.post("./php/dictionary.php", _search, function(msg) {
      if (msg != "fail") {
        $("#vocabulary").empty();
        $("#pronounce").empty();
        $("#word_syllable").empty();
        $("#word_def").empty();

        var _vocabularyArray = msg.slice(0, -1).split("￠");
        var _id = _vocabularyArray[0];
        var _vocabulary = _vocabularyArray[1];
        _fullVocabulary = _vocabularyArray[1];
        var _explanation = _vocabularyArray[2];
        var _parts = _vocabularyArray[3];
        var _syllable = _vocabularyArray[4].split("#");
        var _syllableCount = _vocabularyArray[5];
        var _reserved = _vocabularyArray[6];

        $("#pronounce").append(
          "<audio id='" +
            _vocabulary +
            "'><source src='./upload/words/" +
            _vocabulary +
            ".mp3' type='audio/mp3'></audio><button type='button' id='" +
            _vocabulary +
            "' class='button mini ui' onClick='playSound(this.id)';><i class='play icon'></i>" +
            _vocabulary +
            "</button>" +
            _parts +
            "<hr>"
        );

        if (_syllableCount > 1) {
          $("#word_syllable").append("(共" + _syllableCount + "音節) <br />");
          for (i = 0; i < _syllableCount; i++) {
            $("#word_syllable").append(
              "<audio id='" +
                _syllable[i] +
                "'><source src='./upload/syllable/" +
                _id +
                _syllable[i] +
                ".mp3' type='audio/mp3'></audio><button id='" +
                _syllable[i] +
                "' class='button mini ui' style='width:50%;' onClick='playSound(this.id);'><i class='play icon'></i>" +
                _syllable[i] +
                "</button><br/>"
            );
          }
        } else {
          $("#word_syllable").append("(共" + _syllableCount + "個音節)");
        }
        $("#word_def").append("<hr>" + _explanation);

        //這邊把單字標出顏色
        _searchTime = parseInt(_searchTime);
        _player.currentTime = _searchTime;
        _player.ontimeupdate = null;
        _player.pause();
        $("button#pause.media_control.mini.ui.button").html(
          "<i class='play icon'></i> 播放"
        ); //按紐文字改為播放
        $("button#pause.media_control.mini.ui.button").attr("id", "play"); //按鈕id改為play

        subtitle_english(_searchTime);
        subtitle_chinese(_searchTime);

        setTimeout(function() {
          $(
            "span#" +
              _searchTime +
              ".word_english:contains('" +
              _searchWord +
              "')"
          ).css("background-color", "yellow");
          $(
            "span#" +
              _searchTime +
              ".word_english:contains('" +
              _searchWord +
              "')"
          ).css("font-weight", "bold");
        }, 100);
        userLog(
          _currentUser,
          "searchVocabulary",
          _videoURL,
          _searchWord + "(" + formatSecond(_searchTime) + ")"
        );
      } else {
        console.log(msg);
      }
    });
  }
}

function playSound(_syllable) {
  $("#" + _syllable)[0].play();
}

function vocabularyDelete(_deleteWord, _deleteTime) {
  _tagData = {
    account: _currentUser,
    vocabulary: _deleteWord,
    time: _deleteTime,
    action: "delete"
  };

  if (_deleteWord) {
    $.post("./php/tagVocabulary.php", _tagData, function(msg) {
      if (msg == "success") {
        loadVocabularyTag();
        userLog(
          _currentUser,
          "deleteVocabulary",
          _videoURL,
          _deleteWord + "(" + formatSecond(_deleteTime) + ")"
        );
      }
    });
  } else {
    alert("請選擇要刪除的標記");
  }
}
/******************************左方功能列操作******************************/
//前往首頁
$("#home_link").click(function() {
  //隱藏留言板頁面
  $("#message").fadeOut(100);
  $("#message_content").fadeOut(100);
  //隱藏測驗頁面
  $("#exam_content").fadeOut(100);
  //隱藏排行榜
  $("#reward_content").fadeOut(100);
  //顯示首頁頁面
  $("#home").fadeIn(100);
  $("#home_content").fadeIn(100);

  userLog(_currentUser, "goToHomepage", _videoURL, null);
});

//前往留言板
$("#message_link").click(function() {
  //隱藏首頁頁面
  $("#home").fadeOut(100);
  $("#home_content").fadeOut(100);
  //顯示留言板頁面
  //$("#message").fadeIn(100);
  $("#message_content").fadeIn(100);

  userLog(_currentUser, "goToMessageBoard", _videoURL, null);
});

//前往測驗
$("#exam_link").click(function() {
  //隱藏首頁頁面和其他頁面
  $("#home").fadeOut(100);
  $("#home_content").fadeOut(100);
  $("#reward_content").fadeOut(100);
  //顯示測驗頁面
  $("#exam_content").fadeIn(100);
  //$("#message_content").fadeIn(100);
  _player.pause();
  
  var _time = new Date().getTime(); //紀錄現在系統時間使用
  userLog(_currentUser, "goToExam", _videoURL, null);

  if(_player.currentTime < _maxPlaytime){//表示在複習時間中就跳到測驗
    userLog(_currentUser, "ReviewEnd", _videoURL, _time);
  }
  userLog(_currentUser, "End", _videoURL, _time); //學習結束點
});

//從MENU前往排行榜
$("#reward_link").click(function() {
  //隱藏首頁頁面和其他頁面
  $("#home").fadeOut(100);
  $("#home_content").fadeOut(100);
  $("#exam_content").fadeOut(100);
  //顯示排行榜頁面
  $("#reward_content").fadeIn(100);
  //$("#message_content").fadeIn(100);
  getAllReward();
  userLog(_currentUser, "goToReward", _videoURL, null);
});

//從測驗前往排行榜

function goToReward() {
  //隱藏留言板頁面
  $("#message").fadeOut(100);
  $("#message_content").fadeOut(100);
  //隱藏測驗頁面
  $("#exam_content").fadeOut(100);
  //隱藏首頁頁面
  $("#home").fadeOut(100);
  $("#home_content").fadeOut(100);
  //顯示排行榜
  $("#reward_content").fadeIn(100);

  userLog(_currentUser, "goToReward", _videoURL, null);
  console.log("goToReward");
}

//從排行榜回到影片頁面
function backToVideo() {
  //隱藏留言板頁面
  $("#message").fadeOut(100);
  $("#message_content").fadeOut(100);
  //隱藏測驗頁面
  $("#exam_content").fadeOut(100);
  //隱藏排行榜
  $("#reward_content").fadeOut(100);
  //顯示首頁頁面
  $("#home").fadeIn(100);
  $("#home_content").fadeIn(100);

  userLog(_currentUser, "backToHomepage", _videoURL, null);
}

/******************************影片操作******************************/
function mediaPlay() {
  _player.play(); //開始播放

  $("button#play.media_control.mini.ui.button").html(
    "<i class='pause icon'></i> 暫停"
  ); //按紐文字改為暫停
  $("button#play.media_control.mini.ui.button").attr("id", "pause"); //按鈕id改為pause

  /********影片播放的時候只要確認現在的時間有沒有超過第一次設定的時間，如果沒有就不要管他，如果第一次設定就設定時間*****************/
  //當重播被按下時要確認的事
  var _click = "mediaPlay";
  var _actionTime = _player.currentTime; //第一次影片觀看時間設定使用
  var _time = new Date().getTime(); //紀錄現在系統時間使用
  //1.是不是第一次重播
  if (_maxPlaytime == 0) {
    console.log("這是第一次播放(mediaPlay)，不做設定：" + _maxPlaytime + "現在的動作是影片播放=" + _click);
    //現在系統時間紀錄(計算用)
    userLog(_currentUser, "Start", _videoURL, _time);
    console.log("現在系統時間："+_time);
    //userLog(_currentUser, "LearnPause by VideoReplay", _videoURL, _maxPlaytime);
  } else {
    //2.如果不是第一次播放，有沒有要重新設定最大播放時間
    if (_actionTime >= _maxPlaytime) { //表示開始新的學習-複習時間結束點
      console.log("不是最初開始的播放動作，現在影片時間為：" + _maxPlaytime + "現在的動作是影片播放=" + _click);
      userLog(_currentUser, "ReviewEnd", _videoURL, _time);
      console.log("現在系統時間："+_time);
    } else {
      //console.log("沒有超過原本時間，原本時間為：" + _maxPlaytime + "現在的動作是影片播放=" + _click);
      console.log("這是重播動作中間暫停之後的播放，複習未結束，時間為：" + _maxPlaytime + "現在的動作是影片播放=" + _click);
    }
  }
  /********************************************/

  userLog(//影片時間紀錄
    _currentUser,
    "mediaPlay",
    _videoURL,
    formatSecond(parseInt(_player.currentTime))
  );

}

function mediaPause() { //影片暫停
  _player.pause();
  $("button#pause.media_control.mini.ui.button").html(
    "<i class='play icon'></i> 播放"
  ); //按紐文字改為播放
  $("button#pause.media_control.mini.ui.button").attr("id", "play"); //按鈕id改為play

  /********影片暫停的時候只要確認現在的時間有沒有超過第一次設定的時間，如果沒有就不要管他，如果第一次設定就設定時間*****************/
  //當暫停被按下時要確認的事
  var _click = "mediaPause";
  var _actionTime = _player.currentTime; //第一次影片觀看時間設定使用
  var _time = new Date().getTime(); //紀錄現在系統時間使用
  //1.是不是第一次暫停
  if (_maxPlaytime == 0) {
    _maxPlaytime = _actionTime;
    console.log("這是第一次暫停(mediaPause)，複習開始計算，並設定時間：" + _maxPlaytime + "現在的動作是影片暫停=" + _click);
    userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
    console.log("現在系統時間：" + _time);
  } else {
    //2.如果不是第一次暫停，有沒有要重新設定最大播放時間
    if (_actionTime > _maxPlaytime) {
      _maxPlaytime = _actionTime;
      console.log("超過原本時間，複習開始計算，更新時間為：" + _maxPlaytime + "現在的動作是影片暫停=" + _click);
      userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
      console.log("現在系統時間：" + _time);
    } else {
      console.log("沒有超過原本時間，複習未結束，原本時間為：" + _maxPlaytime + "現在的動作是影片暫停=" + _click);
    }
  }
  /********************************************/

  userLog(//影片時間紀錄
    _currentUser,
    "mediaPause",
    _videoURL,
    formatSecond(parseInt(_player.currentTime))
  );

}

function mediaTag(_currentTime) {
  //要傳送出去的新增標記內容
  _tagData = {
    account: _currentUser,
    tag: _currentTime,
    action: "add"
  };
  //將影片標記傳送到資料庫
  $.post("./php/tagVideo.php", _tagData, function(msg) {
    if (msg == "success") {
      loadTimeTag(); //成功標記、重新讀取下拉選單
      userLog(_currentUser, "mediaTag", _videoURL, formatSecond(_currentTime));
    }
  });
}
/*********************影片重播****************************************************/
/*******
*影片下面的重播功能：重播當前按下去的時間前10S
* _replayTime = _player.currentTime - 10
*******/
function mediaReplay(_replayTime) {

  /***設定判斷是否為第一次學習時間使用***/
  var _actionTime = _replayTime + 10; //按下重播的時間(從10秒前開始複習，當前時間需+10才是真正時間)
  /**********************************/
  var _replayCount = 0;
  _player.currentTime = _replayTime; //由選擇的時間往前回溯10秒

  _start = parseInt(_replayTime);
  _end = parseInt(_replayTime + 10);

  _player.play(); //開始播放
  $("button#play.media_control.mini.ui.button").html(
    "<i class='pause icon'></i> 暫停"
  ); //按紐文字改為暫停
  $("button#play.media_control.mini.ui.button").attr("id", "pause"); //按鈕id改為pause

  userLog( _currentUser, "mediaReplay", _videoURL, "(" + formatSecond(_start) + "~" + formatSecond(_end) + ")已完成" + _replayCount +"次循環");

  //按鈕改為解除重播
  $("button#replay.media_control.mini.ui.button").html("解除重播");
  $("button#replay.media_control.mini.ui.button").attr("id", "release");

  //關閉重播標記、播放標記、播放三個控制按鈕
  $("button.tag_control.mini.ui.button#play").attr("disabled", true);
  $("button.tag_control.mini.ui.button#replay").attr("disabled", true);
  $("button.media_control.mini.ui.button#pause").attr("disabled", true);

  //重播功能開始
  _player.ontimeupdate = function() {
    if (_player.currentTime > _end) {
      _player.currentTime = _start;
      _replayCount++;

      userLog(
        _currentUser,
        "mediaReplay",
        _videoURL,
        "(" +
          formatSecond(_start) +
          "~" +
          formatSecond(_end) +
          ")已完成" +
          _replayCount +
          "次循環"
      );
    }
    /********影片重播的時候只要確認現在的時間有沒有超過第一次設定的時間，如果沒有就不要管他，如果第一次設定就設定時間*****************/
    //當重播被按下時要確認的事
    var _click = "mediaReplay";
    var _time = new Date().getTime(); //紀錄現在系統時間使用
    //1.是不是第一次重播
    if (_maxPlaytime == 0) {
      _maxPlaytime = _actionTime;
      console.log("這是第一次設定：" + _maxPlaytime + "現在的動作是影片重播=" + _click);
      userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
      console.log("現在系統時間：" + _time);
    } else {
      //2.如果不是第一次重播，有沒有要重新設定最大播放時間
      if (_actionTime > _maxPlaytime) {
        _maxPlaytime = _actionTime;
        console.log("超過原本時間，更新時間為：" + _maxPlaytime + "現在的動作是影片重播=" + _click);
        userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
        console.log("現在系統時間：" + _time);
      } else {
        console.log("沒有超過原本時間，原本時間為：" + _maxPlaytime + "現在的動作是影片重播=" + _click);
      }
    }
    /********************************************/
    subtitle_english(_player.currentTime);
    subtitle_chinese(_player.currentTime);
  };
}
/*****************解除影片重播********************************/
function mediaRelease() {//解除重播
  $("button#release.media_control.mini.ui.button").html(
    "<i class='sync icon'></i> 重播"
  );
  $("button#release.media_control.mini.ui.button").attr("id", "replay");

  //啟用重播標記、播放標記、播放三個控制按鈕
  $("button.tag_control.mini.ui.button#play").attr("disabled", false);
  $("button.tag_control.mini.ui.button#replay").attr("disabled", false);
  $("button.media_control.mini.ui.button#pause").attr("disabled", false);

  _player.ontimeupdate = null;
  /**************************************/
  //偵測是否有超過第一次觀看影片的時間，因為getMaxPlaytime使用ontimeupdate，因此需在_player.ontimeupdate = null;後面
  var _event = "mediaRelease";
  getMaxPlaytime(_player.currentTime, _event);//開始偵測影片播放時間-要確認有沒有超過當前時間
  console.log("現在是解除影片重播(mediaRelease)："+_player.currentTime);
  /**************************************/

  userLog(_currentUser, "mediaRelease", _videoURL, null);
}
/*****************音量控制********************************/
function volumeControl(_value, _function) {
  switch (_function) {
    case "大聲":
      if (_value < 100) {
        _player.volume = (_value + 10) / 100;
        $("#volumeInfo").html(_player.volume * 100);
        userLog(_currentUser, "volumeUP", _videoURL, _player.volume);
      }
      break;
    case "小聲":
      if (_value > 0) {
        _player.volume = (_value - 10) / 100;
        $("#volumeInfo").html(_player.volume * 100);
        userLog(_currentUser, "volumeDOWN", _videoURL, _player.volume);
      }
      break;
    default:
      console.log(_function);
  }
}

function speedControl(_value, _function) {
  switch (_function) {
    case "加速":
      if (_value < 2) {
        _player.playbackRate = _value + 0.5;
        $("#speedInfo").html("x" + _player.playbackRate);
        userLog(_currentUser, "speedUP", _videoURL, _player.playbackRate);
      }
      break;
    case "減速":
      if (_value > 0.5) {
        _player.playbackRate = _value - 0.5;
        $("#speedInfo").html("x" + _player.playbackRate);
        userLog(_currentUser, "volumeDOWN", _videoURL, _player.playbackRate);
      }
      break;
    default:
      console.log(_function);
  }
}

/******************************標記操作******************************/
function tagPlay(_selectedTag) {

  var _event = "tagPlay";
  getMaxPlaytime(_player.currentTime, _event);//開始偵測影片播放時間
  console.log("現在是播放標記(tagPlay)："+_player.currentTime);

  _player.currentTime = _selectedTag - 5; //由選擇的時間往前回溯5秒
  _player.play(); //開始播放

  $("button#play.media_control.mini.ui.button").html(
    "<i class='pause icon'></i> 暫停"
  ); //按紐文字改為暫停
  $("button#play.media_control.mini.ui.button").attr("id", "pause"); //按鈕id改為pause

  subtitle_chinese(_selectedTag); //顯示中文字幕
  subtitle_english(_selectedTag); //顯示英文字幕

  userLog(_currentUser, "tagPlay", _videoURL, formatSecond(_selectedTag));
}

function tagDelete(_selectedTag) {
  _tagData = {
    //要傳送出去的刪除標記內容
    account: _currentUser,
    tag: _selectedTag,
    action: "delete"
  };

  //時間標記傳送到資料庫
  if (_selectedTag) {
    $.post("./php/tagVideo.php", _tagData, function(msg) {
      if (msg == "success") {
        loadTimeTag(); //成功刪除、重新讀取下拉選單
        userLog(
          _currentUser,
          "tagDelete",
          _videoURL,
          formatSecond(_selectedTag)
        );
      }
    });
  } else {
    alert("請選擇要刪除的標記");
  }
}
/****************
* 標記重播功能
* 20200115
****************/
function tagReplay(_selectedTag) {
  var _replayCount = 0;
  var _actionTime = _player.currentTime; //第一次影片觀看時間設定使用
  _player.currentTime = _selectedTag - 5; //由選擇的時間往前回溯5秒
  _player.play(); //開始播放

  _start = parseInt(_selectedTag - 5);
    _end = parseInt(_selectedTag); //原本_end = parseInt(_start + 10); 改成只重播到原本標記時間
  //按鈕改為解除重播
  $("button#replay.tag_control.mini.ui.button").html("解除重播");
  $("button#replay.tag_control.mini.ui.button").attr("id", "release");

  //播放改為暫停
  $("button#play.media_control.mini.ui.button").html(
    "<i class='pause icon'></i> 暫停"
  ); //按紐文字改為暫停
  $("button#play.media_control.mini.ui.button").attr("id", "pause"); //按鈕id改為pause

  //關閉重播、播放標記、播放三個控制按鈕
  $("button.tag_control.mini.ui.button#play").attr("disabled", true);
  $("button.media_control.mini.ui.button#replay").attr("disabled", true);
  $("button.media_control.mini.ui.button#pause").attr("disabled", true);

  userLog(
    _currentUser,
    "mediaReplay",
    _videoURL,
    "(" +
      formatSecond(_start) +
      "~" +
      formatSecond(_end) +
      ")已完成" +
      _replayCount +
      "次循環"
  );

  //重播功能開始
  _player.ontimeupdate = function() {
    if (_player.currentTime > _end) {
      _player.currentTime = _start;

      _replayCount++;

      userLog(
        _currentUser,
        "mediaReplay",
        _videoURL,
        "(" +
        formatSecond(_start) +
        "~" +
        formatSecond(_end) +
        ")已完成" +
        _replayCount +
        "次循環"
      );
    }
    /********************************************/
    //當重播被按下時要確認的事
    var _click = "tagReplay";
    var _time = new Date().getTime(); //紀錄現在系統時間使用
    //1.是不是第一次重播
    if (_maxPlaytime == 0) {
      _maxPlaytime = _actionTime;
      console.log("這是第一次設定：" + _maxPlaytime + "現在的動作是標記重播=" + _click);
      userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
      console.log("現在系統時間：" + _time);
    } else {
      //2.如果不是第一次重播，有沒有要重新設定最大播放時間
      if (_actionTime > _maxPlaytime) {
        _maxPlaytime = _actionTime;
        console.log("超過原本時間，更新時間為：" + _maxPlaytime + "現在的動作是標記重播=" + _click);
        userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
        console.log("現在系統時間：" + _time);
      } else {
        console.log("沒有超過原本時間，原本時間為：" + _maxPlaytime + "現在的動作是標記重播=" + _click);
      }
    }

    /*********************************************************/
    subtitle_english(_player.currentTime);
    subtitle_chinese(_player.currentTime);
  };
}
/****************
* 標記重播解除功能
* 20200115
****************/
function tagRelease() {

  $("button#release.tag_control.mini.ui.button").html(
    "<i class='sync icon'></i> 重播標記"
  );
  $("button#release.tag_control.mini.ui.button").attr("id", "replay");

  //啟用重播、播放標記、播放三個控制按鈕
  $("button.tag_control.mini.ui.button#play").attr("disabled", false);
  $("button.media_control.mini.ui.button#replay").attr("disabled", false);
  $("button.media_control.mini.ui.button#pause").attr("disabled", false);

  _player.ontimeupdate = null;
  /****************************************************/
  //解除重播被按下之後，才要開始持續偵測現在影片時間有沒有超過
  var _event = "tagRelease";
  getMaxPlaytime(_player.currentTime, _event);//開始偵測影片播放時間
  //console.log("tagRelease = "+_player.currentTime);
  console.log("現在是解除標記重播(tagRelease)："+_player.currentTime);
  /****************************************************/
  userLog(_currentUser, "tagRelease", _videoURL, null);
}

function userLog(_currentUser, _action, _object, _extention) {
  var _stmt = {
    account: _currentUser,
    action: _action,
    object: _object,
    extention: _extention
  };

  $.post("./php/userLog.php", _stmt, function(msg) {
    if (msg == "success") {
      console.log(_stmt);
      console.log("success");
    }
  });
}

 /****************
 * 取得第一次學習播放影片時間點(計算連續學習時間與複習時間進度條使用)
 * 20200115
 * _actionTime 動作時間
 * _event 執行動作(重播標記、解除重播...)
 ****************/

  function getMaxPlaytime(_actionTime, _event) {
    var _click = _event;
    var _time = new Date().getTime(); //紀錄現在系統時間使用
    _player.ontimeupdate = function() {
      if (_maxPlaytime == 0) {
        _maxPlaytime = _actionTime;
        console.log("這是第一次設定：" + _maxPlaytime + _click);
        userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
        console.log("現在系統時間：" + _time);
      } else {
        //偵測現在影片撥放時間是否有超過_maxPlaytime
        if (_player.currentTime > _maxPlaytime) {

          console.log("你又開始學啦！" + _player.currentTime + _click);
          userLog(_currentUser, "ReviewEnd", _videoURL, _time); //複習結束點
          console.log("現在系統時間："+_time);
          _player.ontimeupdate = null;
        } else {
          console.log("你還在複習！");
        }
        //是否要更新_maxPlaytime
        if (_actionTime > _maxPlaytime) {
          _maxPlaytime = _actionTime;
          // userLog(_currentUser, "continueLearning", _videoURL, _maxPlaytime);
          //_player.ontimeupdate = null;
          console.log("超過原本時間，更新時間為：" + _maxPlaytime + _click);
          userLog(_currentUser, "Review", _videoURL, _time); //複習開始起始點
          console.log("現在系統時間：" + _time);
        }
      }
    };
  }
  /****************************學習時間倒數***************************************/
  /****************
  * 學習時間倒數
  * 20200204
  ****************/
function countdownTime(){

  if (_countdownFlag == 0) { //第一次播放影片，開始學習時間倒數
    _countdownFlag = 1; //flag設1，表示已經開始播放過
    var _iniTime = new Date().getTime(); //設定初始時間(當前時間)
    var _countDownDate = new Date(_iniTime+600000).getTime(); //設定要開始倒數的時間長度(影片時間*2)-600000(10分)
    var _startCountdown = setInterval(function() {
      var _now = new Date().getTime();
      var _distance = _countDownDate - _now; //剩餘時間
      //計算幾分幾秒
      var _minutes = Math.floor((_distance % (1000 * 60 * 60)) / (1000 * 60));
      var _seconds = Math.floor((_distance % (1000 * 60)) / 1000);

      $("#countdown").empty();
      $("#countdown").append(_minutes+"分"+_seconds+"秒");
      //console.log("現在時間：" + _minutes+"分"+_seconds+"秒");

      //時間倒數結束
      if ( _distance < 0) {
        var _time = new Date().getTime(); //紀錄現在系統時間使用
        clearInterval(_startCountdown);
        $("#countdown").append("已結束！");

        userLog(_currentUser, "ReviewEnd", _videoURL, _time); //學習結束點
        userLog(_currentUser, "End", _videoURL, _time); //學習結束點

        console.log("已結束！");
        //跳轉測驗
        _player.pause();
        //隱藏首頁頁面
        $("#home").fadeOut(100);
        $("#home_content").fadeOut(100);
        $("#reward_content").fadeOut(100);
        //顯示測驗頁面
        $("#exam_content").fadeIn(100);
        }
   }, 1000);//var startCountdown = setInterval(function() {
  }else{
      console.log("時間還沒到，重新繼續播放影片");

  }

}

/******************************討論區功能******************************/

$("#message_button").click(function() {
  //貼文功能
  var _postTitle = $("#message_title").val(); //貼文的標題
  var _postContent = CKEDITOR.instances.message_box.getData(); //貼文的內容

  //要傳送出去的貼文內容
  var _post = {
    postTitle: _postTitle,
    postContent: _postContent
  };

  //確認有填寫標題以及內文
  if (_postTitle && _postContent && _currentUser) {
    //傳送留言內容進行儲存
    $.post("./php/post.php", _post, function(msg) {
      if (msg == "success") {
        //成功留言後將輸入框內容清除並顯示留言成功提示
        $("#message_title").val("");
        CKEDITOR.instances.message_box.setData("");
        $("#message_hint").html("留言已送出");
        $("#message_hint").fadeIn(1000);
        $("#message_hint").fadeOut(1000);

        loadPost(); //貼文成功，重新讀取貼文
      }
    });
    userLog(_currentUser, "post", _videoURL, _postTitle);
  } else if ((!_postTitle && _currentUser) || (!_postContent && _currentUser)) {
    $("#message_hint").html("記得填寫內容喔");
    $("#message_hint").fadeIn(1000);
    $("#message_hint").fadeOut(1000);
  }
});




function makeResponse(_id) {
  //產生回應區所見所得編輯器
  $("div#response_area").empty();
  $("div#response_area." + _id).append(
    "<textarea id='response_text' class='" +
      _id +
      "'></textarea><br/><font size='0'><input type='button' id='message_response' class='mini ui button' value='留言' onClick='postResponse(" +
      _id +
      ")';/></font>"
  );
  CKEDITOR.replace("response_text");
}

function postResponse(_id) {
  //回應他人
  if (_currentUser) {
    var _postContent = CKEDITOR.instances.response_text.getData();
    var _post = {
      account: _currentUser,
      response: _id,
      post: _postContent
    };

    if (_postContent) {
      $.post("./php/response.php", _post, function(msg) {
        if (msg == "success") {
          userLog(_currentUser, "response", _videoURL, _id);
          $("div#response_area").empty();
        }
      });
    }
  } else {
    console.log("未登入");
  }
}

function loadPost() {
  //載入留言
  $.post("./php/loadPost.php", function(msg) {
    if (msg != "fail") {
      //清空留言顯示區
      $("#message_past").empty();
      //處理留言資料
      var _postArray = msg.slice(0, -1).split("￠");
      //顯示留言
      for (
        i = 0, j = 1, k = 2, l = 3, m = 4;
        i < _postArray.length;
        i += 5, j += 5, k += 5, l += 5, m += 5
      ) {
        if (_postArray[i]) {
          $("#message_past").append(
            "<font size='0'>" +
              "#" +
              _postArray[i] +
              "　" +
              _postArray[j] +
              "　" +
              _postArray[k] +
              "　" +
              _postArray[l] +
              "　" +
              "<input type='button' id='" +
              _postArray[i] +
              "' class='response mini ui button' value='回應' onClick='makeResponse(" +
              _postArray[i] +
              ")'/></font><br/>"
          );
        } else {
          $("#message_past").append("目前沒有留言喔～");
        }

        $("#message_past").append(_postArray[m]);
        $("#message_past").append(
          "<div id='response_area' class='" + _postArray[i] + "'></div><hr>"
        );
      }
    }
  });
}
/******************排行榜-d3-timeline**************************************/
var testData_p1 = [
  /*{label: "person a", times: [
    {"starting_time": 1355752800000, "ending_time": 1355759900000},
    {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
  {label: "person b", times: [
    {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
  {label: "person c", times: [
    {"starting_time": 1355761910000, "ending_time": 1355763910000}]}*/
  {
    //顏色1
    times: [
      { label:"WWW", color: "green", starting_time: 0, ending_time: 100 },
      { color: "blue", starting_time: 40, ending_time: 60 },
      { color: "blue", starting_time: 80, ending_time: 85 },
    ]
  },
  {
    times: [
      //顏色2
      { starting_time: 10, ending_time: 15 }
    ]
  },
  {
    times: [
      //顏色3
      { starting_time: 85, ending_time: 100 }
    ]
  }
];
var testData_p2 = [
  {
    times: [
      //顏色1
      { starting_time: 0, ending_time: 30 },
      { starting_time: 90, ending_time: 100 }
    ]
  },
  {
    times: [
      //顏色2
      { starting_time: 40, ending_time: 45 }
    ]
  },
  {
    times: [
      //顏色3
      { starting_time: 50, ending_time: 100 }
    ]
  }
];

var chart = d3.timeline().showTimeAxis();
//console.log(chart);
//var svg =
d3
  .select("#learnBar_1")
  .append("svg")
  .attr("width", 500)
  .datum(testData_p1)
  .call(chart);
//$("#p1").append(svg1);
//$("#p2").append("this is p2");
d3
  .select("#learnBar_2")
  .append("svg")
  .attr("width", 500)
  .datum(testData_p2)
  .call(chart);
/*var svg2 = d3.select("#learn_bar_P2").append("svg").attr("width", 500)
  .datum(testData_p1).call(chart);
  $("#p2").append(svg2);*/

//取得使用者資料
function getAllReward() {
  $.post("./php/getSession.php", function(data) {
    console.log(data);
    if (data != "fail") {
      _currentUser = data;

      $("#userName").append(_currentUser);
      console.log(_currentUser);
      console.log("getAllReward success");
    } else {
      console.log("getAllReward error");
    }
  });
}
