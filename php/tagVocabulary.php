<?php
//啟用session
session_start();
//連線
require('connect.php');

//使用者留言資料
$account = $_SESSION['account'];
$vocabulary = $_POST['vocabulary'];
$time = $_POST['time'];
$action = $_POST['action'];

//將時間標記存入資料庫中
if ($_SESSION['authenticated'] == true) {
    //新增標籤
    if ($action == 'add') {
        //先確認是否標記過
        $row_column = $pdo->query("SELECT * FROM tag_vocabulary WHERE account='$account' AND vocabulary='$vocabulary' AND videoTime='$time'");
        if ($row_column->fetchColumn() > 0) {
            //標記過，先確認enable值
            $result = $pdo->query("SELECT enable FROM tag_vocabulary WHERE account='$account' AND vocabulary='$vocabulary' AND videoTime='$time'");
            $row = $result->fetch();
            if ($row['enable'] == '0') {
                //將enable值改為1
                $sql = "UPDATE tag_vocabulary SET enable='1' WHERE account='$account' AND vocabulary='$vocabulary' AND videoTime='$time'";
                $pdo->prepare($sql)->execute([$account, $vocabulary, $time]);

                $pdo = null;
                echo "success";
            } else {
                $pdo = null;
                echo "success";
            }
        } else {
            //沒標記過，直接新增
            $sql = "INSERT INTO tag_vocabulary (account, vocabulary, videoTime) VALUES ('$account', '$vocabulary', $time)";
            $pdo->prepare($sql)->execute([$account, $vocabulary, $time]);

            $pdo = null;
            echo "success";
        }
    } elseif ($action == 'delete') {
        //將該單字的enable值改為0
        $sql = "UPDATE tag_vocabulary SET enable='0' WHERE account='$account' AND vocabulary='$vocabulary' AND videoTime='$time'";
        $pdo->prepare($sql)->execute([$account, $vocabulary, $time]);

        $pdo = null;
        echo "success";
    }
}
