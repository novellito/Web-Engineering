<?php session_start(); 

if(!isset($_SESSION["username"])){
  header("Location: index.php"); exit();
}

else if(isset($_SESSION["username"]) && $_SESSION["username"] == "customer") { ?>
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
include('navbar.php');
include('db.php');

$query = "SELECT product_id, display_name, price, size FROM products";
$req = $db->query($query);

while($row = $req->fetch_assoc()) {
  echo  "
    <tr>
      <td> {$row['display_name']} </td>
      <td> {$row['price']} </td>
      <td> {$row['size']} </td>
      <td><button name={$row['product_id']} type='submit' class='btn btn-primary'>Add to Cart</button></td>
    </tr>"; 
}

$_SESSION['cart'][] = $_POST; //add item to cart

$req->close();
?>
</tbody>
</table>
</form>

<?php } ?>
