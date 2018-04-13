<?php
include('navbar.php'); 
include('db.php');
session_start();

if(isset($_SESSION["username"])) {
  header("Location: index.php"); exit();
}

else if(!(isset($_SESSION["username"]))){

 if($_SERVER['REQUEST_METHOD'] === 'POST'){

  $username = $_POST['username'];
  $pw       = $_POST['password'];
  if(empty($username) || empty($pw)) {
    
    echo "<h1>youre not allowed</h1>";

  } else {
    
    if($username === "customer") {
      $query = "SELECT * FROM users WHERE username = 'customer'";
      $req   = $db->query($query);
      $res   = $req->fetch_object();

      if($res->password===$pw || $pw === 'customer'){
        $_SESSION["username"] = $res->username;
        $_SESSION["user_id"]  = $res->user_id; 

        header("Location: index.php");
        exit();

      } else {
        echo "<h1>you're not allowed</h1>";
      }
    
      $req->close();
      } else if($username === "barista") {

        $query = "SELECT * FROM users WHERE username = 'barista'";
        $req   = $db->query($query);
        $res   = $req->fetch_object();
     
        if($res->password===$pw || $pw === 'barista'){
          session_start();
          $_SESSION["username"] = $res->username;
          $_SESSION["user_id"]  = $res->user_id; 
  
          header("Location: index.php");
          exit();

        } else {
          echo "<h1>youre not allowed</h1>";
        }
        $req->close();
      }
  }
 } ?>

<div class="container login">

  <div class="col-md-6 mx-auto">
  <p>Customer pw - b39f008e318efd2bb988d724a161b61c6909677f</p>
  <P>Barista pw - e1386ca049393ffb6bba56d5a5106ae72e6a9e13</P>
  
    <div class="card">
      <div class="card-body mx-4">

        <form method="POST">
           <div class="form-group">
             <label for="username">Username</label>
             <input type="text" name="username" value="customer" class="form-control" id="username" placeholder="Enter username">
           </div>
           <div class="form-group">
             <label for="exampleInputPassword1">Password</label>
             <input type="password" class="form-control" name="password" placeholder="Password">
           </div>
           <button type="submit" class="btn btn-primary">Login</button>
       </form>
      </div>
    </div>

  </div>
</div>

<?php }  ?>
