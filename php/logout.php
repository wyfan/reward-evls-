<?php
//啟用session
session_start();
//是否登入過
if ($_SESSION['authenticated'] == true)
{
    $_SESSION = array();

    if (isset($_COOKIE[session_name() ]))
    {
        setcookie(session_name() , '', time() - 42000, '/');
    }

    session_destroy();

    echo "logout";
}
