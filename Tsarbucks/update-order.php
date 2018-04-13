<?php
include('db.php');

$order_id   = array_keys($_POST)[0];
$product_id = array_values($_POST)[0];

//create a json response object
$res = new stdClass();
$res->order_id   = $order_id;
$res->product_id = $product_id;

$json_res = json_encode($res);
echo $json_res;

  $update_order = "UPDATE orders SET completed = 1 WHERE order_id = '$order_id' AND product_id = '$product_id' ";

  $db->query($update_order);
   
?>