<?php

// Detaily databáze
$servername = "db.dw207.webglobe.com";
$username = "memomate";
$password = "K0dD3G3a";
$dbname = "memomate";

// Vytvoření spojení
$conn = new mysqli($servername, $username, $password, $dbname);

// Kontrola spojení
if ($conn->connect_error) {
    $response = ['success' => false, 'message' => 'Chyba připojení k databázi'];
    echo json_encode($response);
    exit;
}

?>