<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者留言資料
$account = $_SESSION['account'];
$title = $_POST['postTitle'];
$message = $_POST['postContent'];

//將留言存入資料庫中
if ($_SESSION['authenticated'] == true)
{
    $sql = "INSERT INTO message_post (account,title, message) VALUES ('$account','$title', '$message')";
    $pdo->prepare($sql)->execute([$account, $title, $message]);

    $pdo = null;
    echo "success";
}
else
{
    $pdo = null;
    echo "fail";
}
