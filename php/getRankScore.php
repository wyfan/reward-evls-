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
      $result = $pdo->query("SELECT reward_total_score.account, reward_total_score.score
                             FROM reward_total_score
                             JOIN user_list ON (reward_total_score.account=user_list.account)
                             WHERE reward_total_score.object = '$videourl'
                              AND user_list.class = '$class'
                             ORDER BY reward_total_score.score DESC
                             LIMIT 5

                              ");
      $rows = $result->fetchAll(PDO::FETCH_ASSOC);
      $res = [];

      foreach($rows as $row) {
              //echo $row['account']."||".$row['action']."||".$row['extention']."---"."<br />";
              //time:1234
              //data[0].time
              //admin**2020-02-07 00:39:09**ReviewEnd**158105400938

              $value_json=array(
                'account'=>$row['account'],
                'score'=>$row['score']
              );
              array_push($res,$value_json);

      }
      $pdo = null;
      echo json_encode($res);

}else{
    $pdo = null;
    echo "fail";
}
