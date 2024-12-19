<?php
$mysqli = new mysqli('localhost', 'root', 'root', 'local');
if ($mysqli->connect_error) {
    die('Database connection failed: ' . $mysqli->connect_error);
}
echo 'Database connection successful!';
?>
