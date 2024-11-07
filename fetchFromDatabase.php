<?php
header('Content-Type: application/json');

// pripojeni k databazi
require_once 'settings/db.php';

// Priprava a vykonani SQL dotazu
$sql = "SELECT id, title, content, date_created FROM notes WHERE is_completed = 0"; 
$result = $conn->query($sql);

// Inicializace pole pro ulozeni dat
$response = [];

// Nacitani dat do pole
while ($row = $result->fetch_assoc()) {
    $response[] = $row; // Pridani radku do pole
}

// zavreni pripojeni
$conn->close();

// Vrati JSON pole
header('Content-Type: application/json');
echo json_encode($response);

?>
