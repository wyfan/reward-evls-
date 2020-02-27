<?php
//啟用session
session_start();

require('../../php/connect.php');

$qId = $_POST['qId'];
$selectStr = $_POST['selectStr'];
$selected = $_POST['selected'];
$account = $_SESSION['account'];
$action = 'Quiz';
$extention = $selectStr.';'.$selected;

if( isset($qId) == true){
   //寫入測驗題LOG
  //addQuizLog($account, $qId, $selected, $selectStr);
   $sql_quiz = "INSERT INTO quiz_log (account, q_number, user_selected, correct) VALUES ('$account','$qId', '$selected', '$selectStr')";
   $pdo->prepare($sql_quiz)->execute([$account, $qId, $selected, $selectStr]);

  //寫入UserLog
  //addUserLog($account, $action, $aId, $extention);
   $sql_log = "INSERT INTO user_log (account,action, object, extention) VALUES ('$account','$action', '$qId', '$extention')";
   $pdo->prepare($sql_log)->execute([$account, $action, $qId, $extention]);

  //$res = '第幾題：'.$qId.'|正確與否：'.$selectStr.'|選項：'.$selected;
  echo $selectStr; //回傳是否有答對(correct/error)

}else {
  echo "fail";
}


// function addQuizLog($account, $q_number, $user_selected, $correct){
//   if(isset($account) == true){
//     $sql = "INSERT INTO quiz_log (account, q_number, user_selected, correct) VALUES ('$account','$q_number', '$user_selected', '$correct')";
//     $pdo->prepare($sql)->execute([$account, $q_number, $user_selected, $correct]);
//
//   }else {
//     echo "addQuizLog fail";
//   }
// }

// function addUserLog($account, $action, $qId, $extention){
//   if(isset($account) == true){
//     $sql = "INSERT INTO user_log (account,action, object, extention) VALUES ('$account','$action', '$qId', '$extention')";
//     $pdo->prepare($sql)->execute([$account, $action, $qId, $extention]);
//
//   }else{
//     echo "addUserLog fail";
//   }
// }
