<?php
$data = json_decode(file_get_contents("php://input"), true);

$cardId = isset($data['cardId']) ? $data['cardId'] : null;
$updatedTitle = $data['title'];
$updatedContent = $data['content'];

// pripojeni k databazi
require_once 'settings/db.php';

// Příprava SQL dotazu pro aktualizaci
$sql = "UPDATE notes SET title = ?, content = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

// Ladění: Zobrazí, jaké hodnoty se posílají do databáze
error_log("Pokouším se aktualizovat následující hodnoty:");
error_log("Card ID: " . $cardId);
error_log("Title: " . $updatedTitle);
error_log("Content: " . $updatedContent);

// Ověření, že příprava dotazu proběhla úspěšně
if (!$stmt) {
    die("Chyba při přípravě dotazu: " . $conn->error);
}

// Vázání parametrů - použijte $updateTitle a $updateContent místo $title a $content
$stmt->bind_param("ssi", $updatedTitle, $updatedContent, $cardId);

// Inicializace odpovědi
$response = [];

// Spuštění dotazu
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['error'] = "Chyba: " . $stmt->error;
    echo $stmt->error; // Pro ladění
}

// Uzavření připojení k databázi
$conn->close();

// Nastavení hlavičky pro JSON odpověď
header('Content-Type: application/json');

// Odeslání odpovědi ve formátu JSON
echo json_encode($response);
?>