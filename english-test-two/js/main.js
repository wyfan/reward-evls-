$(function () {
    var app = new Vue({
        el: "#app",
        data: {
            startShow: false,    //初始第一页的显示
            endShow: true,      //末尾页的显示
            contentShow: true, //做题内容页的显示
            questionList: [],   //lists对象数组
            question_type: [],  //问题种类type的标题
            listsId: 0,         //当前做题页码第一页是0
            user_result:[],
            select: '',       //答题的结果对错
            finish: {},         //结尾页json数据
            judgeTrue: 0,        //判断题对勾选项
            judgeFalse: 0,       //判断题叉选项
            annId: -1,          //单选选中答案索引
            answer: [],           //多选答案顺序数组
            vacancyCon: '',       //单选填空显示单词
            vacancyArr: [],    //多选填空显示单词
            correctSum: 0,    //答對的題數總數
            errorSum: 0,       //答錯的題數總數
            answerTime: 0      //作答次數

        },
        mounted: function () {
            this.getQuestionList(); //取得題目的資料
        },
        methods: {
            /*初始数据ajax请求-20200226 - 題目資料*/
            getQuestionList: function () {
                $.ajax({
                    // url: "http://test.zhituteam.com/index.php/home/api/getquestion",
                    url: "./json/first.json",
                    type: "get",
                    dataType: "json",
                    data: {
                        type: 2,
                        level: 94,
                        lesson: 1360,
                        question_flag: 2
                    },
                    success: function (res) {
                        app.questionList = res.result.lists; //题目列表
                        app.question_type = res.result.question_type; //题型列表
                        console.log(app.question_type);
                    },
                    error: function () {
                        alert("請求錯誤");
                    }
                })
            },
            /*初始页点击start*/
            starBtn: function () {
                this.startShow = true;  //初始页隐藏
                this.contentShow = false; //做题也出现
                this.listsId = 0;  //开始页码调整到第一页
                if (app.answerTime == 0){
                  app.answerTime = app.answerTime +1;
                  console.log("現在作答次數為："+app.answerTime);
                }
            },
            /*上一题点击*/
            prveClick: function () {
                if (this.listsId == 0) {
                    this.startShow = false;  //初始页出现
                    this.contentShow = true; //做题也隐藏
                } else {
                    this.listsId -= 1;
                }
            },
            /*點擊下一題*/
            /*2020226 - 由RadioAnswer()送出請求去對答案(本專案使用單選題)*/
            nextClick: function () {
                console.log("nexcClick的listId"+this.listsId);
                if (this.listsId == this.questionList.length - 1) {  //到达最后一页
                    this.contentShow = true; //做题页隐藏
                    this.endShow = false;//末尾页出现
                    //20200302 - 最後一題沒有送出，要補一次判斷
                    this.RadioAnswer();
                    //再做獲取總分的動作
                    this.finishget();//最后一页get提交获取成绩评分(原專案使用)
                    this.correctCount(app.answerTime); //取得最後答對總題數
                } else {
                    if (this.questionList[this.listsId].type == 4) { //判断题答案
                        this.judgeAnswer();
                        this.clearAll();    //清除选中
                    } else if (this.questionList[this.listsId].type == 5) {//單選答案驗證
                        this.RadioAnswer();
                        this.clearAll();    //清除选中
                    } else if (this.questionList[this.listsId].type == 6) {//多选答案
                        this.selectAnswer();
                    }
                }
            },
            /*播放題目音檔*/
            playQuestion: function () {
                //console.log(this.listsId);
                console.log("有沒有出現~");

            },
            /*清除判断/单选/多选的选中状态*/
            clearAll: function () {
                this.judgeFalse = 0; //清空判断选中状态
                this.judgeTrue = 0; //清空判断选中状态
                this.answer = [];  //清空多选答案数组
                this.annId = -1;   //恢复单选选项
                this.vacancyCon = '';//单选填空清空
                this.vacancyArr = [];//多选的填空清空
                this.select = ''    //本题post请求对错清除
            },
            /*判断题答案验证*/
            judgeAnswer: function () {
                if (this.judgeTrue == 1 && this.judgeFalse == 0) {  //所选答案
                    judgeAn(0); //选√时传0，
                    this.listsId += 1; //页码加1
                    console.log(this.listsId);
                } else if (this.judgeTrue == 0 && this.judgeFalse == 1) {
                    judgeAn(1);
                    this.listsId += 1; //页码加1
                    console.log(this.listsId);
                } else {
                    alert('您還沒做出判斷喔');
                }
                /*答案對不對的驗證*/
                function judgeAn(stemIndex) {  //判断答案验证stemIndex为选择的√×
                    var thisId = app.questionList[app.listsId].data.id; //获取当前题的id
                    if (app.questionList[app.listsId].data.stem[stemIndex].istrue == 1) {
                        app.select = 'ok'; //判断当前选择答案是否正确
                        app.answerPost(thisId, app.select, stemIndex);//本题信息post
                    } else {
                        app.select = 'error';
                        app.answerPost(thisId, app.select, stemIndex)

                    }
                }
            },
            /*單選題答案驗證 - 20200226 本專案使用之題型*/
            RadioAnswer: function () {
                if (this.annId == -1) { //annId ->使用者選擇的答案ID
                    alert('您還沒有做出選擇喔！');
                } else {
                    var thisId = this.questionList[this.listsId].data.id; //獲取當前題目的ID(第幾題)
                    //var selected = (this.annId + 1) + '=' + this.vacancyCon;//獲取當前選擇答案的索引與內容
                    var selected = (this.annId + 1); //當前使用者選擇的答案
                    if (this.questionList[this.listsId].data.stem[this.annId].istrue == 1) { //如果選擇的選項是對的(istrue)
                        console.log("回答正確");
                        console.log("第幾次作答"+ app.answerTime +"題號："+ thisId + "使用者選擇："+selected);
                        this.select = 'correct';
                        //this.answerPost(thisId, this.select, selected); //原本專案使用
                        this.answerCheck(thisId, this.select, selected, app.answerTime); //20200226 - 本專案使用
                    } else {
                        console.log("回答錯誤");
                        console.log("第幾次作答"+ app.answerTime +"題號："+ thisId + "使用者選擇："+selected);
                        this.select = 'error';
                        //this.answerPost(thisId, this.select, selected);
                        this.answerCheck(thisId, this.select, selected, app.answerTime); //20200226 - 本專案使用
                    }
                    this.listsId += 1; //页码加1
                }
            },
            /*多选题答案验证*/
            selectAnswer: function () {
                if (this.answer.length < 6) {
                    alert('填空未填滿');
                } else {
                    var answerNum = this.answer.join('');   //把数组元素拼接成字符串
                    var thisId = this.questionList[this.listsId].data.id; //获取当前题的id
                    //把索引数组与内容数组遍历取出，对象字符串拼接重组数组，对数组join()分割-----
                    var selected = [];
                    for (var i = 0; i <= 5; i++) {
                        selected[i] = (this.answer[i] - 1) + '=' + this.vacancyArr[i]
                    }
                    var selected2 = selected.join('&');
                    //--------------------------------------------------------------------
                    if (this.questionList[this.listsId].data.answer == answerNum) {
                        this.select = 'ok';
                        this.answerPost(thisId, this.select, selected2)
                    } else {
                        this.select = 'error';
                        this.answerPost(thisId, this.select, selected2)
                    }
                    this.listsId += 1; //页码加1
                    this.clearAll();    //多选题确定能到下一页是才清除选中
                }
            },
            /*单选点击选项*/
            type5Click: function (index) {
                $('.type5-option').eq(index).addClass('type5Click').siblings().removeClass('type5Click');
                this.annId = index;   //当前单选的索引
                //this.vacancyCon = $('.type5-option').eq(index).html();//单选选中内容赋值
            },
            /*多选点击选项*/
            type6Click: function (index) {
                var option = $('.type5-option');
                var index2 = option.eq(index).html(); //当前点击的选项内容
                if (option.eq(index).hasClass('type5Click')) { //判断是否选中
                    option.eq(index).removeClass('type5Click');

                    this.answer.splice($.inArray(index + 1, this.answer), 1);//删除内容为index的元素
                    this.vacancyArr.splice($.inArray(index2, this.vacancyArr), 1);
                } else {
                    option.eq(index).addClass('type5Click');
                    this.answer.push(index + 1); //把当前选中的索引放到数组里
                    this.vacancyArr.push(index2)  //把当前选中的内容放到数组里
                }
                $('.vacancy').html('');  //填空前先清空填空的内容
                $.each(this.vacancyArr, function (index, val) {
                    $('.vacancy').eq(index).html(val);  //遍历内容数组并复制给相应个填空
                })
            },
            /*判断点击选项*/
            judgeClick1: function () {
                this.judgeTrue = 1;
                this.judgeFalse = 0;
            },
            judgeClick2: function () {
                this.judgeFalse = 1;
                this.judgeTrue = 0;
            },
            /*回到首页*/
            btnAgain: function () {
                this.endShow = true;  //末尾页出现
                this.startShow = false; //首页出现
                this.listsId = 0;     //页码恢复初始
            },
            /*點擊下一題時 對當前題目答案的提交-原專案使用*/
            answerPost: function (id, select, selected) {
                $.ajax({
                    // url: "http://test.zhituteam.com/index.php/home/api/ajaxHandle",
                    url: "./json/first.json",
                    type: "post",//此处应该为post，本地演示改为post
                    dataType: "json",
                    data: {
                        id: id,
                        select: select,
                        selected: selected
                    },
                    success: function () {
                        // console.log('提交本题post请求');
                    },
                    error: function () {
                        alert("本題POST請求出錯！");
                    }
                })
            },
            /*點擊下一題時 對當前題目答案的提交* 2020 - 從這邊POST 到PHP將答題資訊存進DB去*/
            answerCheck: function (id, select, selected, answerTime) {//id=題號 select=ok/error(答對/答錯) selected=使用者選擇的選項
                var _answerData = {
                  qId: id, //題目ID
                  selectStr:select, //OK OR ERROR
                  selected: selected, //選擇的選項
                  answerTime: answerTime
                  };
                $.post("./php/answerSend.php", _answerData, function(_checkResult) {
                   if(_checkResult != "fail"){

                     console.log("有什麼東西從PHP來了："+ _checkResult);
                     if(_checkResult =="correct"){
                       app.correctSum = app.correctSum+1;
                      console.log("答對幾題了："+ app.correctSum);
                     }else{
                       app.errorSum = app.errorSum+1;
                       console.log("答錯幾題了："+ app.errorSum);
                     }

                   }else{
                     console.log("什麼東西都沒有！");
                   }

                 })

            },
            /*答题结束请求最后结果成绩*/
            finishget: function () {
                $.ajax({
                    // url: "http://test.zhituteam.com/index.php/home/api/finish",
                    url: "./json/finish.json",
                    type: "get",
                    dataType: "json",
                    data: {
                        type: 2,
                        level: 94,
                        lesson: 1360,
                        question_flag: 2
                    },
                    success: function (res) {
                        app.finish = res.result //答题结果数据
                    },
                    error: function () {
                        alert("成绩信息请求错误");
                    }
                })
            },
            /*點擊最後一題時 取得答對題數*/
            correctCount: function (_answerTime) {
              var _quizData = {
                answerTime: _answerTime
              };
              $.post("./php/getCorrectCount.php", _quizData, function(_correctCount){
                if(_correctCount != "fail"){
                  console.log("你答對了幾題：" + _correctCount);
                }else{
                  console.log("什麼東西都沒有in getCorrectCount！");
                }


              })
            }

        }
    });
});
