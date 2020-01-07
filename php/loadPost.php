<?php
//啟用session
session_start();
//連線
require('connect.php');

//讀取先前留言內容
if ($_SESSION['authenticated'] === true) {
    $result = $pdo->query("SELECT id, title, account, timestamp, message FROM message_post WHERE enable ='1'");
    $rows = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        foreach ($row as $key => $value) {
            echo $value."￠";
        }
    }
} else {
    echo "fail";
}
//結束連線
$pdo = null;
