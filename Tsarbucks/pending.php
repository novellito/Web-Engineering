<?php session_start(); include('navbar.php');
if(!isset($_SESSION["username"])) {
  header("Location: index.php"); exit();
} else if(isset($_SESSION["username"]) && $_SESSION["username"] == "barista") {
?>
<div class="container">
<div class="row d-flex justify-content-center">
<div class="col-lg-10">
<?php
include('db.php');

$table = "
<table class='table'>
<thead>
  <tr>
    <th scope='col'>Product Name</th>
    <th scope='col'>Size (oz)</th>
    <th scope='col'>Quantity</th>
    <th scope='col'>Price</th>
    <th scope='col'>Status</th>
  </tr>
</thead>
<tbody>";

    $query = "SELECT * FROM orders JOIN products ON orders.product_id = products.product_id WHERE completed = 0 ";
    $req   = $db->query($query);
    $prev  = "";
    $price_total = $oz_total = 0;
    
    while($row = $req->fetch_assoc()) {
        
         $curr = $row['order_id'];
         
            if($curr == $prev || $prev ==""){
              if($prev=="") {
                $table .= "<h1>Order #{$row['order_id']}</h1>"; //output first order#
              }
                $table .= 
                "<tr>
                    <td> {$row['display_name']}  </td>
                    <td> {$row['size']} </td>
                    <td> {$row['quantity']} </td>
                    <td>$ {$row['price']} </td>
                    <form class='pending-stat' >
                    <input type='hidden' name={$row['order_id']} value={$row['product_id']}>
                    <td><button type='submit' class='btn btn-primary prod'>Mark Complete</button></td>
                    </form>
               </tr>";
               
                echo $table;
          
                $table = "";
                $price_total += $row['price'] * $row['quantity'];
                $oz_total    += $row['size']  * $row['quantity'];
                $prev  = $curr;

                } else {   
                
                      $table   = "<b>Total Price: $  $price_total </b> <br><b>Total Size: $oz_total oz</b>";
                      $table  .= "<table class='table'>
                      <thead>
                        <h1>Order #{$row['order_id']}</h1>
                          <tr>
                            <th scope='col'>Product Name</th>
                            <th scope='col'>Size (oz)</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Status</th>
                          </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td> {$row['display_name']}  </td>
                        <td> {$row['size']} </td>
                        <td> {$row['quantity']} </td>
                        <td>$ {$row['price']} </td>
                        <form class='pending-stat' >
                        <input type='hidden' name={$row['order_id']} value={$row['product_id']}>
                        <td><button  type='submit' class='btn btn-primary prod'>Mark Complete</button></td>
                        </form>
                    </tr>";
                echo $table;
                $price_total = $oz_total = 0;
                $price_total += $row['price'] * $row['quantity'];
                $oz_total    += $row['size']  * $row['quantity'];
                $table = "";   
                $prev = $curr;
              }
        }
        echo  "<b>Total Price: $  $price_total </b><br>";
        echo  "<b>Total Price: $  $oz_total </b>";
        $req->close();
?>
</div>
</div>
</div>


<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script>

$(function() {
  
    var socket = io('http://localhost:3000');

    $(".pending-stat").submit(function(e){
      
      e.preventDefault();
      let btn_ref = $(this).find("btn[type=submit]:clicked"); // get a reference to the clicked button
      let btn     = btn_ref.prevObject[0][1]; //target the button html content
      let data    = $(this).serializeArray();
      
        $.ajax({
            url: 'update-order.php',
            type: 'POST',
            data: data,
            success: function(res){
              socket.emit('completed', res);
              $(btn).replaceWith("<span class='badge badge-success'>Complete</span>");
          }
      });
      
  });
  
});

</script>  
<?php }?>

