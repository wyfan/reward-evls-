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
  $result = $pdo->query("SELECT reward_total_score.account, reward_total_score.object, reward_total_score.score
                         FROM reward_total_score
                         JOIN user_list ON (reward_total_score.account=user_list.account)
                         WHERE  reward_total_score.account = '$account'
                            AND reward_total_score.object = '$videourl'
                            AND user_list.class = '$class'
                          ");
  $rows = $result->fetchAll(PDO::FETCH_ASSOC);
  foreach ($rows as $row) {
    $score = $row['score'];
  }

  echo $score;


}else{
  $pdo = null;
  echo "fail";

}
