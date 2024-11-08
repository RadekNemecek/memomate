<?php

// nastaveni hlavicky
header('Content-Type: application/json; charset=UTF-8');
$response = ['success' => false, 'message' => ''];


// propojeni k db
require_once 'settings/db.php';


// prijeti a decodovani JSON
$data = json_decode(file_get_contents("php://input"));

// kontrola platnosti JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    $response = ['success' => false, 'message' => 'Neplatný formát dat.'];
    echo json_encode($response);
    exit();
}

// osetreni vstupnich hodnot
$email = trim($data->email);
$password = trim($data->password);

error_log("Zadané heslo při loginu: " . $password);
error_log("Zadany email při loginu: " . $email);


// SQL dotaz pro ziskani uzivatele dle emailu
$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
if (!$stmt) {
    $response = ['success' => false, 'message' => 'Chyba při přípravě dotazu.'];
    echo json_encode($response);
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Kontrola, zda byl nalezen uzivatel s danym emailem
if ($result->num_rows > 0) {
    // hash heslo z db
    $row = $result->fetch_assoc();
    $hashedPassword = $row['password'];

    error_log("kontrola nalezení uživatele v db: " . $hashedPassword);
    
    // overeni hesla
    if (password_verify($password, $hashedPassword)) {
    // if (password_verify('123123123', '$2y$10$6ER5dn//JVpJyVyu/PAtfef8ljaD16EmfeQjV2WANW794YpYuyrti')) {
        error_log("pass verify: " . $password);
        error_log("Hashované verify: " . $hashedPassword);
        // pokud je heslo spravne
        $response = ['success' => true, 'message' => 'Přihlášení úspěšné'];
       
    } else {

        // Debug
        error_log("Zadané heslo při verifikaci: " . $password);
        error_log("Hashované heslo z loginu: " . $hashedPassword);
        error_log("Ověření hesla: " . (password_verify($password, $hashedPassword) ? 'true' : 'false'));


        // Heslo je nespravne
        $response = ['success' => false, 'message' => 'Nesprávné heslo.'];
    }
} else {
    // Uživatel s daným emailem nebyl nalezen
    $response = ['success' => false, 'message' => 'Uživatel nenalezen.'];
}

// Odeslani odpovedi jako JSON
echo json_encode($response);

$conn->close();

?>