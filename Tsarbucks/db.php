<?php
$db = new mysqli("p:localhost" , "root", "", "tsarbucks");
if($db->connect_error){
  die("could not conenct");
}
?>