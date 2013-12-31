<?php
   header("Content-disposition: attachment; filename=recording.json");
   header("Content-type: application/json");
   echo $_POST["data"];
?>
