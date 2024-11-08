<?php

header("Content-Type: application/json");

require_once 'settings/db.php';



// Precti JSON data z tela pozadavku
$data = json_decode(file_get_contents("php://input"), true);

// Ziskani dat
$title = $data['title'];
$content = $data['content'];

// Priprava SQL dotazu pro vlozeni dat
$sql = "INSERT INTO notes (title, content) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $title, $content);

$response = [];
if ($stmt->execute()) {
    $response["success"] = "Data byla úspěšně vložena.";
} else {
    $response["error"] = "Chyba: " . $stmt->error;
}

// Uzavreni spojeni
$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "message" => "Data byla úspěšně uložena."]);

?>