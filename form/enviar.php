<?php

header('Content-Type: application/json');

require __DIR__ . '/validate.php';
require __DIR__ . '/rate_limit.php';
require __DIR__ . '/config.php';
require __DIR__ . '/email_template.php';
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Honeypot: real visitors never see or fill this field. Pretend success so
// bots don't learn to look for a different signal.
if (trim($data['website'] ?? '') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!enforceRateLimit($ip)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'errors' => ['general' => 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.']]);
    exit;
}

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

    $whatsappDigits = preg_replace('/[^0-9]/', '', $whatsapp);

    $mail->Subject = "Nuevo lead: {$nombre} - Landing Dr. Lagos";
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Body = renderLeadEmailBody($nombre, $whatsapp, $ciudad, $whatsappDigits);
    $mail->AltBody = "Nuevo lead desde la landing\n\nNombre: {$nombre}\nWhatsApp: {$whatsapp}\nCiudad: {$ciudad}";

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'errors' => ['general' => 'No se pudo enviar el correo. Intenta por WhatsApp.']]);
}
