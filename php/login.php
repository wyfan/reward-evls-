<?php
//啟用session
session_start();
//連線
require('connect.php');
$videoURL = './upload/video.mp4';

//是否登入過
if ($_SESSION['authenticated'] == true) {
    //echo $_SESSION['account'].'+'.$_SESSION['year'].'+'.$_SESSION['class'];
    echo $_SESSION['account'];
    $user = $_SESSION['account'];

    $pdo = null;
    return;
} else {
    //使用者登入資料
    $user = $_REQUEST['account'];
    $pwd = $_REQUEST['password'];

    //取得有效帳號資料
    $row_column = $pdo->query("SELECT account, year, class
                               FROM user_list
                               WHERE account='$user' AND password='$pwd' AND enable ='1'");

    //確認是否有該使用者帳號
    //if ($row_column->fetchColumn() > 0) {
    if ($row_column->rowCount() > 0) {

        //寫入Session
        $_SESSION['authenticated'] = true;
        $_SESSION['account'] = $user;
        $_SESSION['videoURL'] = $videoURL;

        //取得年級和班級並寫入Session
        $rows = $row_column->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
          $_SESSION['year'] = $row['year'];
          $_SESSION['class'] = $row['class'];
        }

        echo $_SESSION['account'].$_SESSION['videoURL'];

        $pdo = null;
        return;
    } else {
        echo "fail";
        $pdo = null;
        return;
    }
}
