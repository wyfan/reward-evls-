<?php
//啟用session
session_start();

//看看要取哪種類型的SESSION
$sessionType = $_POST['type'];

//是否登入過
if ($_SESSION['authenticated'] == true) {

    if($sessionType !== NULL){

      echo $_SESSION['account'].'+'.$sessionType;


    }else{
      echo "session noooo!!!";
    }



} else {
    echo "fail";
}
