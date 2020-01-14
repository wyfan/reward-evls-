<?php
//啟用session
session_start();
//連線
//require('connect.php');

//使用者資料

if ($_SESSION['authenticated'] == true) {
    echo $_SESSION['account'];
} else {
    echo "fail";
}
