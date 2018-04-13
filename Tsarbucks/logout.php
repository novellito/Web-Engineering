<?php 
//from slides :)
$_SESSION = array();
// Kill the session by destroying the session
// cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
// Finally, destroy the session itself.
session_destroy();
header("Location: index.php");
exit();

?>