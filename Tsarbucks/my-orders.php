<?php session_start(); include('navbar.php'); include('db.php');
if(!isset($_SESSION["username"])) {
  header("Location: index.php"); exit();
}
?>

<div class="container">
<div class="row d-flex justify-content-center">
<div class="col-lg-10">

<?php if(isset($_SESSION["username"]) && $_SESSION["username"] == "customer") {

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

        $query       = "SELECT * FROM orders JOIN products ON orders.product_id = products.product_id WHERE orders.user_id = {$_SESSION['user_id']} ORDER BY completed";
        $req         = $db->query($query);
        $prev        = "";
        $price_total = $oz_total = 0;
        while($row = $req->fetch_assoc()) {

          if($row['completed'] == 0) {
            $pending_stat = "<span class='badge badge-secondary'>Pending</span>";
          } else {
            $pending_stat = "<span class='badge badge-success'>Complete</span>";
          }
                $curr = $row['order_id'];
   
                if($curr == $prev || $prev =="") {
                  if($prev=="") {
                    $table .= "<h1>Order #".$row['order_id']."</h1>"; //output first order#
                  }

                    $table .= 
                    "
                    <tr class=  '{$row['product_id']} {$row['order_id']}'>
                      <td> {$row['display_name']} </td>
                      <td> {$row['size']} </td>
                      <td> {$row['quantity']} </td>
                      <td>$ {$row['price']} </td>
                      <td> {$pending_stat} </td>
                    </tr>
                    ";
                echo $table;

                $table        = "";
                $price_total += $row['price'] * $row['quantity'];
                $oz_total    += $row['size']  * $row['quantity'];
                $prev         = $curr;

                } else {   
                  
                    $table   = "<b>Total Price: $  $price_total </b> <br><b>Total Size: $oz_total oz</b>";
                    $table  .= "<table class='table'>
                    <thead>
                    <h1>Order # {$row['order_id']} </h1>
                      <tr>
                        <th scope='col'>Product Name</th>
                        <th scope='col'>Size (oz)</th>
                        <th scope='col'>Quantity</th>
                        <th scope='col'>Price</th>
                        <th scope='col'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr class=  '{$row['product_id']} {$row['order_id']}'  >
                      <td> {$row['display_name']} </td>
                      <td> {$row['size']} </td>
                      <td> {$row['quantity']} </td>
                      <td>$ {$row['price']} </td>
                      <td> {$pending_stat} </td>  
                    </tr>";
                    echo $table;
                    $price_total = $oz_total = 0;
                    $price_total += $row['price'] * $row['quantity'];
                    $oz_total    += $row['size']  * $row['quantity'];
                    $table        = "";   
                    $prev         = $curr;
                  }      
        }
        echo  "<b>Total Price: $  $price_total </b><br>";
        echo  "<b>Total Price: $  $oz_total </b>";
        $req->close();
?>

</tbody>
</table>
</div>
</div>
</div>
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script>
    $(function() {

        var socket = io('http://localhost:3000');

        socket.on("updateCustomer",function(res){
            let response = JSON.parse(res);
            $(`.${response.product_id}.${response.order_id}`).css('background-color', "#94d094");
            $(`.${response.product_id}.${response.order_id} .badge`).replaceWith("<span class='badge badge-success'>Complete</span>");
        });
    });
</script>     
<?php 
}
?>

