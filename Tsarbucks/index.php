<?php
session_start();
include('navbar.php');
if(!isset($_SESSION["username"])) { //user not logged in
?>

<h1>Home</h1>
<a class="btn btn-danger" href="login.php">Login</a> or leave.
<?php } ?>

<?php if(isset($_SESSION["username"]) && $_SESSION["username"] == "customer") { ?>

    <h1>Home</h1>        
    <a href="customer-menu.php">Buy something</a> or <a href="logout.php">get out</a>
        
    <?php } else if(isset($_SESSION["username"]) && $_SESSION["username"] == "barista") { ?>
        <h1>Home</h1>        
        <a href="pending.php">Make something</a> or <a href="logout.php">or leave</a>
    <?php } ?>

