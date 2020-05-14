//所有的 function 修正請到 allFunctions.js 這個檔案
$.getScript("js/allFunctions.js", function() {
  //伴隨頁面載入的功能
  (function(window, document) {
    login(); //登入

    $("button").click(function() {
      //取得按鈕的類別 (media_control, vocabulary_control, tag_control)
      _buttonType = $(this).attr("class");
      //取得按鈕的功能 (play, pause, replay, tag, delete ...等)
      _buttonFunction = $(this).attr("id");
      if (_currentUser) {
        //有登入的畫開放下列功能
        switch (_buttonType) { //判斷控制按鈕分類
          /******************************media_control 開始******************************/
          case "media_control mini ui button": //播放器控制
            switch (_buttonFunction) { //根據按鈕功能進行切換
              case "play": //影片播放功能
                mediaPlay();
                countdownTime();
                console.log("0514 - _isRelogin = "+_isRelogin);
                break;

              case "pause": //影片暫停功能
                mediaPause();
                break;

              case "tag": //新增影片標記
                mediaTag(Math.round(_player.currentTime));
                break;

              case "replay": //影片重播
                mediaReplay(_player.currentTime - 10); //從10秒前開始複習
                break;

              case "release":
                mediaRelease();
                break;

              case "volume":
                var _value = _player.volume * 100;
                var _function = $(this).val();
                volumeControl(_value, _function);
                break;

              case "speed":
                var _value = _player.playbackRate;
                var _function = $(this).val();
                speedControl(_value, _function);
                break;

              default:
                //不在上面的操作，藉此Debug
                console.log(_buttonType, _buttonFunction);
            }
            break;
          /******************************tag_control開始******************************/
          case "tag_control mini ui button": //時間標記控制
            switch (_buttonFunction) { //根據按鈕功能進行切換
              case "play": //播放標記
                tagPlay(
                  $("#tag_select")
                    .find(":selected")
                    .val()
                );
                break;

              case "delete": //刪除時間標記
                tagDelete(
                  $("#tag_select")
                    .find(":selected")
                    .val()
                );
                break;

              case "replay": //重播時間標記
                tagReplay(
                  $("#tag_select")
                    .find(":selected")
                    .val()
                );
                break;

              case "release": //解除重播功能
                tagRelease();
                break;

              default:
                //不在上面的操作，藉此Debug
                console.log(_buttonType, _buttonFunction);
            }
            break;
          /******************************vocabulary_control開始******************************/
          case "vocabulary_control mini ui button": //單字標記控制
            switch (_buttonFunction) {
              case "search":
                dictionarySearch(
                  $("#word_select")
                    .find(":selected")
                    .val(),
                  $("#word_select")
                    .find(":selected")
                    .attr("id")
                );
                break;

              case "delete":
                vocabularyDelete(
                  $("#word_select")
                    .find(":selected")
                    .val(),
                  $("#word_select")
                    .find(":selected")
                    .attr("id")
                );
                break;

              default:
                //不在上面的操作，藉此Debug
                console.log(_buttonType, _buttonFunction);
            }
            break;
        }
      } else {
        alert("登入才能使用喔");
      }
    }); //播放器控制、單字標記控制、時間標記控制 結束

    //20200512 - 單字雙擊查詢
    $("#word_select").dblclick(function(){
      dictionarySearch(
        $("#word_select")
          .find(":selected")
          .val(),
        $("#word_select")
          .find(":selected")
          .attr("id")
      );
    });


    //影片開關
    $("input.videoSwitch").click(function() {
      if (_currentUser) {
        var _status = $(this).prop("checked");

        if (_status == true) {
          $("video").css("visibility", "visible");
        } else if (_status == false) {
          $("video").css("visibility", "hidden");
        }
        userLog(_currentUser, _status, _videoURL, "videoArea");
      } else {
        alert("登入才能使用喔");
      }
    });

    //字幕開關
    $("input.subtitle").click(function() {
      if (_currentUser) {
        var _language = this.id;
        var _status = $(this).prop("checked");

        if (_language == "chinese") {
          if (_status == true) {
            console.log("中文開");
            $("#view_chinese").css("visibility", "visible");
          } else if (_status == false) {
            console.log("中文關");
            $("#view_chinese").css("visibility", "hidden");
          }
        } else if (_language == "english") {
          if (_status == true) {
            console.log("英文開");
            $("#view_english").css("visibility", "visible");
          } else if (_status == false) {
            console.log("英文關");
            $("#view_english").css("visibility", "hidden");
          }
        }
        userLog(_currentUser, _status, _videoURL, _language);
      } else {
        alert("登入才能使用喔");
      }
    });
  })(this, this.document);
});
