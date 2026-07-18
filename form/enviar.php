<?php

header('Content-Type: application/json');

require __DIR__ . '/validate.php';
require __DIR__ . '/config.php';
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$errors = validateFormData($data);

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

$nombre = trim($data['nombre']);
$whatsapp = trim($data['whatsapp']);
$ciudad = trim($data['ciudad']);

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;

    $mail->setFrom(SMTP_USERNAME, 'Landing Dr. Héctor Lagos');
    $mail->addAddress(LEAD_RECIPIENT);

    $mail->Subject = 'Nuevo lead desde la landing';
    $mail->Body = "Nombre: {$nombre}\nWhatsApp: {$whatsapp}\nCiudad: {$ciudad}";

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'errors' => ['general' => 'No se pudo enviar el correo. Intenta por WhatsApp.']]);
}
