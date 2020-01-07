<?php
//資料庫登入資訊
$dsn = "mysql:host=localhost;dbname=video;port=3306;charset=utf8";
$root = 'root';
$mysql_pwd = 'la2391';

//以PDO連線資料庫
try {
    $pdo = new PDO($dsn, $root, $mysql_pwd);
} catch (PDOException $e) {
    exit("DB CAN'T CONNECT!");
}
