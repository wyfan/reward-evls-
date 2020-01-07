<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者留言資料
$account = $_SESSION['account'];

//將時間標記存入資料庫中
if ($_SESSION['authenticated'] == true) {
    $result = $pdo->query("SELECT tag FROM tag_time WHERE account = '$account' AND enable ='1' ORDER BY tag ASC");
    $rows = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        foreach ($row as $key => $value) {
            echo $value.",";
        }
    }
    $pdo = null;
} else {
    $pdo = null;
    echo null;
}
