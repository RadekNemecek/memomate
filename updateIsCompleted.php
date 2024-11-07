<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// pripojeni k databazi
require_once 'settings/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$is_completed = $data['is_completed'];

$sql = "UPDATE notes SET is_completed = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $is_completed, $id);

$response = [];
if ($stmt->execute()) {
    $response["success"] = true;
} else {
    $response["error"] = $stmt->error; // Získejte chybu z dotazu
}

// Uzavření dotazu a spojení
$stmt->close();
$conn->close();

// Zajistěte, že vždy vracíte JSON
echo json_encode($response);
?>
