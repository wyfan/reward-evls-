<?php

//啟用session
session_start();

require('../../php/connect.php');

$answerTime = $_POST['answerTime']; //回答次數
$account = $_SESSION['account']; //使用者
$videoURL = $_SESSION['videoURL']; //第幾部影片(第幾堂課)

if( isset($answerTime) == true){
  $result = $pdo->query("SELECT quiz_Rcount.R_count
                         FROM quiz_Rcount
                         WHERE  quiz_Rcount.account = '$account'
                         AND quiz_Rcount.lesson = '$videoURL'
                          ");
  $rows = $result->fetchAll(PDO::FETCH_ASSOC);
  foreach($rows as $row) {
    $Rcount = $row['R_count'];
  }

  
  echo $Rcount;

}else{
  //沒有接收到資料
  echo "fail";
}
