<?php

//啟用session
session_start();

require('../../php/connect.php');

$answerTime = $_POST['answerTime']; //回答次數
$account = $_SESSION['account']; //使用者
$videoURL = $_SESSION['videoURL']; //第幾部影片(第幾堂課)

if( isset($answerTime) == true){

  echo $account.$videoURL;

}else{
  //沒有接收到資料
  echo "fail";
}
