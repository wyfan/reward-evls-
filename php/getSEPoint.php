<?php
//啟用session
session_start();
//連線
require('connect.php');


//使用者資料
if(isset($_POST['user'])){
  $account = $_POST['user'];
}else{
  $account = $_SESSION['account'];
}

$year = $_SESSION['year'];
$class = $_SESSION['class'];
$videourl = $_POST['videoURL'];


/*if(isset($_POST['videoURL'])) {

print_r($videourl."123456");
}else{
  print_r('NOOOOOO');
}*/
if ($_SESSION['authenticated'] == true) {
    //20200217 - SQL加入影片連結、使用者班級、年級的判斷，以作為未來多班級使用
    $result = $pdo->query("SELECT user_log.account, timestamp, action, extention
                           FROM user_log
                           LEFT JOIN user_list ON user_list.account=user_log.account
                           WHERE  user_log.account = '$account'
                              AND user_log.object = '$videourl'
                              AND user_list.year ='$year'
                              AND user_list.class = '$class'
                              AND ( user_log.action = 'Start' OR  user_log.action ='End')
                           ORDER BY user_log.timestamp ASC
                           LIMIT 2
                            ");

    $rows = $result->fetchAll(PDO::FETCH_ASSOC);
    $res = [];
    foreach($rows as $row) {
            //echo $row['account']."||".$row['action']."||".$row['extention']."---"."<br />";
            //time:1234
            //data[0].time
            //admin**2020-02-07 00:39:09**ReviewEnd**158105400938

            $value_json=array(
              'extention'=>$row['timestamp']
            );
            array_push($res,$value_json);

    }
    echo json_encode($res);


}else {
    echo "fail";
}
