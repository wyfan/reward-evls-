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
  $result = $pdo->query("SELECT account, object, score
                         FROM reward_total_score
                         WHERE  account = '$account'
                            AND object = '$videourl'
                          ");
  $rows = $result->fetchAll(PDO::FETCH_ASSOC);
  foreach ($rows as $row) {
    $score = $row['score'];
  }
  $pdo = null;
  echo $score;


}else{
  $pdo = null;
  echo "fail";

}
