<?php
//啟用session
session_start();

//是否登入過
if ($_SESSION['authenticated'] == true) {
    echo $_SESSION['account'];
} else {
    echo "fail";
}
