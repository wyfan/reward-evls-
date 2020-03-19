<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者資料
$account = $_SESSION['account'];
$year = $_SESSION['year'];
$class = $_SESSION['class'];
$videourl = $_SESSION['videoURL'];

if ($_SESSION['authenticated'] == true) {
  $result = $pdo->query("SELECT quiz_Rcount.account, quiz_Rcount.total, quiz_Rcount.R_count
                         FROM quiz_Rcount
                         JOIN user_list ON (quiz_Rcount.account=user_list.account)
                         WHERE  quiz_Rcount.account = '$account'
                            AND quiz_Rcount.lesson = '$videourl'
                            AND user_list.class = '$class'
                         ");
  $rows = $result->fetchAll(PDO::FETCH_ASSOC);
  $res=[];
  foreach($rows as $row) {

    $value_json=array(
      'quiz_total'=>$row['total'],
      'quiz_right'=>$row['R_count']
    );
  }
  $pdo = null;
  echo json_encode($value_json);


}else{
  $pdo = null;
  echo "fail";

}
