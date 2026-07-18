# Landing Dr. Héctor Lagos

## Desarrollo local

1. `npm install`
2. `composer install`
3. `cp form/config.example.php form/config.php` y completar `SMTP_PASSWORD` con la contraseña real del correo `contacto@drhectorlagos.com` en Hostinger.
4. `npm run build:css` (o `npm run watch:css` mientras editás)
5. `php -S localhost:8000`
6. Abrir `http://localhost:8000/index.html`

## Tests

- JS: `npm run test:js`
- PHP: `php form/tests/validate_test.php`

## Antes de desplegar

1. Reemplazar `PIXEL_ID_PLACEHOLDER` y `G-XXXXXXXXXX` en `index.html` con los IDs reales de Meta Pixel y Google Analytics 4.
2. Confirmar que `form/config.php` tiene la contraseña SMTP real (no se sube al repo, solo al servidor).
3. Ejecutar `npm run build:css` para regenerar `assets/css/output.css` con los últimos cambios.
4. Ejecutar `composer install` para regenerar `vendor/`.

## Subir a Hostinger (hosting compartido)

Subir estos archivos y carpetas a `public_html` vía el Administrador de Archivos de hPanel (o FTP):

- `index.html`
- `assets/` (incluyendo `css/output.css` ya compilado)
- `form/` (incluyendo `enviar.php`, `validate.php` y `config.php` con credenciales reales — **no** subir `form/tests/`)
- `vendor/`

**No subir:** `node_modules/`, `package.json`, `package-lock.json`, `tailwind.config.js`, `assets/css/input.css`, `composer.json`, `composer.lock`, `form/config.example.php`, `form/tests/`, `docs/`.

Verificar después de subir:
- El sitio carga por HTTPS (certificado SSL gratuito de Hostinger activo).
- El formulario de contacto envía el correo real y abre WhatsApp.
- El botón flotante de WhatsApp y todos los enlaces de WhatsApp usan el número +57 310 330 0851.
