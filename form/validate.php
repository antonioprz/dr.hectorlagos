<?php

function validateFormData(array $data): array
{
    $errors = [];

    $nombre = trim($data['nombre'] ?? '');
    $whatsapp = trim($data['whatsapp'] ?? '');
    $ciudad = trim($data['ciudad'] ?? '');

    if (mb_strlen($nombre) < 3) {
        $errors['nombre'] = 'Ingresa tu nombre completo.';
    }
    if (!preg_match('/^\+?[0-9\s]{7,15}$/', $whatsapp)) {
        $errors['whatsapp'] = 'Ingresa un número de WhatsApp válido.';
    }
    if (mb_strlen($ciudad) < 2) {
        $errors['ciudad'] = 'Ingresa tu ciudad de residencia.';
    }

    return $errors;
}
