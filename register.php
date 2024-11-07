<?php
header("Content-Type: application/json");

// nacteni JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// ziskani emailu a hesla
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

error_log("uzivatelské heslo pri registraci: " . $password);
error_log("uzivatelský email pri registraci: " . $email);


// Overeni, ze email a pass nejsou prazdne
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "PHP - Zadejte email a heslo."]);
    exit;
}

// pripojeni k db
require_once 'settings/db.php';

// Hashovani hesla
$hashedpassword = password_hash($password, PASSWORD_DEFAULT);

error_log("Hashovane heslo pri registraci: " . $hashedpassword);

// SQL dotaz pro kontrolu existence emailu
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "PHP - Email je již zaregistrován. Použijte jiný email."]);
    exit;
}

// SQL dotaz pro vlozeni noveho uzivatele
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashedpassword);

error_log("Hashované heslo pri registraci po db: " . $hashedpassword);
error_log("email pri registraci po db: " . $email);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "PHP Registrace úspěšná!"]);
} else {
    echo json_encode(["status" => "error", "message" => "PHP Chyba: " . htmlspecialchars($stmt->error)]);
}


$conn->close();
?>
