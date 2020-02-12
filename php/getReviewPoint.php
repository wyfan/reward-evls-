<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者資料
$account = $_SESSION['account'];
$videourl = $_POST['videoURL'];


/*if(isset($_POST['videoURL'])) {

print_r($videourl."123456");
}else{
  print_r('NOOOOOO');
}*/

if ($_SESSION['authenticated'] == true) {
    $result = $pdo->query("SELECT account, timestamp, action, extention
                           FROM user_log
                           WHERE account = '$account' AND  object = '$videourl' AND (action = 'Review' OR action ='ReviewEnd')
                           ORDER BY `user_log`.`timestamp` DESC
                            ");
    $rows = $result->fetchAll(PDO::FETCH_ASSOC);
    $res = [];
    foreach($rows as $row) {
      //print_r($row['extention']);
        //foreach ($row as $key => $value) {
            //echo $row['account']."||".$row['action']."||".$row['extention']."---"."<br />";
            //time:1234
            //data[0].time
            //admin**2020-02-07 00:39:09**ReviewEnd**158105400938
            $value_json=array(
              'extention'=>$row['extention']
            );
            array_push($res,$value_json);
           //$value_json_result = json_encode($vale_json, JSON_NUMERIC_CHECK);

            //echo $value_json_result."**";
            //echo $value;
            //echo 'extention'." : ".$value['extention'].'|||';
        //}
        //$value_json = json_encode($value_json, JSON_NUMERIC_CHECK);


    }
    echo json_encode($res);


}else {
    echo "fail";
}
