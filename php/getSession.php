<?php
//啟用session
session_start();

//看看要取哪種類型的SESSION
$sessionType = $_POST['type'];

//是否登入過
if ($_SESSION['authenticated'] == true) {

    //session type有值
    if(isset($sessionType) == true){
      switch ($sessionType){
        case "account":
          echo $_SESSION['account'].'+ $sessionType = '.$sessionType;
          break;
        case "year":
          echo $_SESSION['year'].'+ $sessionType = '.$sessionType;
          break;
        case "class":
          echo $_SESSION['class'].'+ $sessionType = '.$sessionType;
          break;
        default:
          echo "無此種Type SESSION喔！";

      }
    }else{
      echo "sessionType fail";
    }

} else {
    echo "fail";
}
