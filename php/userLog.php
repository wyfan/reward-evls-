<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者留言資料
$account = $_POST['account'];
$action = $_POST['action'];
$object = $_POST['object'];
$extention = $_POST['extention'];

//寫入LOG資料
if ($_SESSION['authenticated'] == true) {
    $sql = "INSERT INTO user_log (account,action, object, extention) VALUES ('$account','$action', '$object', '$extention')";
    $pdo->prepare($sql)->execute([$account, $action, $object, $extention]);
    echo "success";
} else {
    $pdo = null;
    echo "fail";
}
