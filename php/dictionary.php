<?php
//啟用session
session_start();
//連線
require('connect.php');

$vocabulary = $_POST['vocabulary'];

//確認字典內容
if ($_SESSION['authenticated'] === true) {
    $result = $pdo->query("SELECT vocabulary FROM dictionary WHERE vocabulary = '$vocabulary'");
    $result->execute();
    $count = $result->rowCount();

    if ($count == 1) {
        //有單字且只有一筆資料
        $result = $pdo->query("SELECT id, vocabulary, explanation, parts, syllable, syllable_count, reserved FROM dictionary WHERE vocabulary = '$vocabulary'");
        $rows = $result->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            foreach ($row as $key => $value) {
                echo $value."￠";
            }
        }
    } elseif ($count >1) {
        echo "more";
    } else {
        echo "fail";
    }
} else {
    echo "fail";
}

//結束連線
$pdo = null;
