<?php

require __DIR__ . '/../validate.php';

function assertEqual($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: $message\n  expected: " . var_export($expected, true) . "\n  actual:   " . var_export($actual, true) . "\n");
        exit(1);
    }
    echo "PASS: $message\n";
}

assertEqual([], validateFormData([
    'nombre' => 'Ana García',
    'whatsapp' => '+57 300 000 0000',
    'ciudad' => 'Cali',
]), 'valid data produces no errors');

assertEqual(
    'Ingresa tu nombre completo.',
    validateFormData(['nombre' => 'Al', 'whatsapp' => '+573000000000', 'ciudad' => 'Cali'])['nombre'],
    'short name is flagged'
);

assertEqual(
    'Ingresa un número de WhatsApp válido.',
    validateFormData(['nombre' => 'Ana García', 'whatsapp' => 'abc', 'ciudad' => 'Cali'])['whatsapp'],
    'invalid whatsapp is flagged'
);

assertEqual(
    'Ingresa tu ciudad de residencia.',
    validateFormData(['nombre' => 'Ana García', 'whatsapp' => '+573000000000', 'ciudad' => ''])['ciudad'],
    'missing ciudad is flagged'
);

echo "All validate.php tests passed.\n";
