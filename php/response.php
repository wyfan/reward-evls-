<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者留言資料
$account = $_SESSION['account'];
$postid = $_POST['response'];
$message = $_POST['post'];

//將留言存入資料庫中
if ($_SESSION['authenticated'] == true)
{
    $sql = "INSERT INTO message_response (account, postid, message) VALUES ('$account','$postid', '$message')";
    $pdo->prepare($sql)->execute([$account, $postid, $message]);

    $pdo = null;
    echo "success";
}
else
{
    $pdo = null;
    echo "fail";
}
