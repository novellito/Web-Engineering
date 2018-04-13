<?php 
session_start();
include('navbar.php');
if(!isset($_SESSION["username"])) {
  header("Location: index.php"); exit();
}
else if(isset($_SESSION["username"]) && $_SESSION["username"] == "customer") {
?>
<div class="container">
<div class="row d-flex justify-content-center">
<div class="col-lg-10">
<form method='POST' action="">

<table class="table">
  <thead>
    <tr>
      <th scope="col">Product Name</th>
      <th scope="col">Price</th>
      <th scope="col">Size (oz)</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>

<?php
include('db.php');

if(isset($_POST["save"])) {

  $order = [];
  foreach($_SESSION['cart'] as $order_id) { //store elements in a more manageable array
    foreach($order_id as $key=>$value) {
      $order[] = $key;
    }
  }

  $order        = array_count_values($order); //return count of each item
  $get_order_id = "SELECT MAX(order_id)+1 AS order_id FROM orders"; //retrieve the last order_id from db
  $req          = $db->query($get_order_id);
  $res          = $req->fetch_object();
  $new_order_id = $res->order_id;
  $req->close();
  
  foreach($order as $key=>$value) {

    $insert_order = "INSERT INTO orders(order_id,user_id, product_id,quantity) VALUES ('$new_order_id', {$_SESSION['user_id']}, '$key', '$value')";

    $db->query($insert_order);
  
  }
  $_SESSION['cart'] = []; //reset cart
  header("Location: my-orders.php");
  exit();

}

  if(!empty($_POST)) { 
    
    $value = array_search($_POST, $_SESSION['cart']);
    if(($value = array_search($_POST, $_SESSION['cart'])) !== false){
      unset($_SESSION['cart']["$value"]); //remove item from cart
    }
      $_POST = []; //reset post value
  }

if(!empty($_SESSION['cart'])) {

  $query       = "SELECT display_name, price, size FROM products WHERE product_id = ";
  $req         = $db->query($query);
  $price_total = $oz_total = 0;
  foreach($_SESSION['cart'] as $item) {
    foreach($item as $key => $val) {
      
      $query = "SELECT display_name, price, size FROM products WHERE product_id = $key ";
      $req   = $db->query($query);
      while($row = $req->fetch_assoc()) {
        echo  "
        <tr>
          <td>{$row['display_name']} </td>
          <td> {$row['price']} </td>
          <td> {$row['size']} </td>
          <td><button name=".$key." type='submit' class='btn btn-danger'>Remove from cart</button></td>          
        </tr>"; 
        
        $price_total += $row['price'];
        $oz_total    += $row['size'];
      }
      $req->close();
    }
  }

  echo "
  </tbody>
  </table>
  <b>Total Cost: $ $price_total </b>
  <br>
  <b>Total Size: $oz_total ounces</b>
  <br>
  <button name='save' type='submit' class='btn btn-primary'>Submit order!</button>
  </form>";
  
} else {
  echo "<h1>Your cart is empty D:</h1>";
}
?>


</div>
</div>
</div>
<?php 
}

?>
