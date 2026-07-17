# Landing page — Dr. Héctor Lagos (Cirugía Bariátrica)

## Contexto

Landing page de una sola página (one-page) para captar pacientes que llegan desde Instagram y otras redes sociales. Reemplaza un intento previo en WordPress + Elementor (descartado por ser lento/tedioso de mantener). No hay sitio en vivo actualmente — es un proyecto nuevo.

El diseño visual ya está resuelto en Stitch (Google) y se entregó como:
- `code.html` — export funcional en HTML + Tailwind CDN + JS vanilla
- `DESIGN.md` — design tokens (colores, tipografía, espaciado, formas)
- `screen.png` — captura del diseño completo
- Logo (`Mesa de trabajo 1 copia 7@2x.png`, wordmark con mariposa) y paleta de colores (`paleta de colores.jpeg`)
- Flyer de referencia con datos de contacto reales (dirección, WhatsApp)

Este documento define cómo se traduce ese export a un sitio productivo, desplegable en Hostinger (hosting compartido).

## Objetivo

Convertir tráfico de redes sociales en:
1. Contactos directos por WhatsApp (botón flotante + enlaces "Contactar por WhatsApp")
2. Leads capturados por formulario (nombre, WhatsApp, ciudad) que llegan por email **y** disparan un WhatsApp precargado
3. Engagement vía el "Test de Candidato" interactivo (4 pasos) que termina invitando a agendar

## Datos reales a usar (confirmados con el cliente)

- **Ubicación:** Cali, Valle del Cauca — Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013
- **WhatsApp:** +57 310 330 0851 (usado en todos los enlaces `wa.me` y el botón flotante)
- **Email de contacto (formulario):** contacto@drhectorlagos.com
- El texto "Medellín, Colombia" que trae el export original de Stitch es incorrecto y se reemplaza por la dirección de Cali.

## Stack técnico

**HTML/CSS/JS estático + PHP para el formulario**, sin build de Node en el servidor:

- Un único `index.html` con anclas internas (`#beneficios`, `#test`, `#historias`, `#contacto`) — mismas secciones que ya trae el export de Stitch.
- Tailwind CSS **compilado localmente** (no el script CDN que trae el export — ese es solo para prototipos y Tailwind avisa que no debe usarse en producción). Se genera `assets/css/output.css` a partir de un `tailwind.config.js` con los design tokens de `DESIGN.md` (colores, fuentes, radios, spacing) migrados tal cual.
- Google Fonts (Playfair Display + Work Sans) y Material Symbols vía `<link>`, igual que en el export.
- JS vanilla en `assets/js/script.js`: reveal-on-scroll, barra de progreso, lógica del test de 4 pasos, validación y envío del formulario, apertura de WhatsApp.
- `form/enviar.php`: procesa el formulario con PHPMailer, responde JSON.

### Estructura de archivos

```
/
├── index.html
├── assets/
│   ├── css/output.css       (generado, no editar a mano)
│   ├── css/input.css        (fuente de Tailwind, con @tailwind directives)
│   ├── js/script.js
│   └── img/                 (logo + imágenes descargadas localmente)
├── form/
│   └── enviar.php
├── vendor/                  (PHPMailer, vía Composer)
├── tailwind.config.js
└── package.json             (solo para compilar Tailwind en local, no se sube al hosting)
```

Al desplegar a Hostinger se sube todo **excepto** `package.json`, `node_modules` y `assets/css/input.css` (no hacen falta en el servidor).

## Secciones de la landing (basadas 1:1 en el export de Stitch)

1. **Nav fijo** — logo (imagen real, reemplaza el texto "LOGO"), anclas a Beneficios/Historias/Test/Contacto, botón "Agendar Cita".
2. **Hero** — titular, subtítulo, botones "Agendar valoración" (ancla a #contacto) y "Contactar por WhatsApp" (wa.me).
3. **Beneficios (autodiagnóstico)** — 5 tarjetas tipo bento con los "dolores" del paciente potencial, CTA "Hablar con un especialista".
4. **Test de Candidato** — 4 pasos reales (ver sección siguiente), termina con CTA a agendar.
5. **Historias que inspiran** — 3 tarjetas antes/después con testimonios (contenido ya definido en el export).
6. **Formulario de contacto** — nombre, WhatsApp, ciudad → envía email + abre WhatsApp. Incluye dirección y email de contacto reales.
7. **Footer** — logo, descripción, enlaces (Aviso de Privacidad, Términos, Urgencias), horarios, íconos de redes sociales.
8. **Botón flotante de WhatsApp** — visible en todo momento del scroll (se agrega, no está en el export original como flotante — actualmente solo hay enlaces inline).

## Test de Candidato — las 4 preguntas

El export de Stitch solo implementaba el paso 1 (rango de edad) y simulaba saltar directo al resultado final en cualquier click. Se completa con lógica real de 4 pasos:

1. **Rango de edad** (ya existente): 18-30 / 31-45 / 46-60 / Más de 60
2. **Situación de peso actual:** 10-20kg de sobrepeso / +20kg de sobrepeso / Obesidad diagnosticada / No estoy seguro
3. **Intentos previos:** Dietas y ejercicio sin éxito / Medicamentos / Aún no he probado nada serio / Ya tuve cirugía bariátrica (revisión)
4. **Condiciones de salud asociadas:** Diabetes tipo 2/prediabetes / Hipertensión / Apnea del sueño o dolores articulares / Ninguna, quiero prevenir

Cada botón avanza al siguiente paso (barra de progreso 25/50/75/100%). Al terminar el paso 4, se muestra siempre un resultado positivo invitando a agendar la valoración, con una nota aclaratoria: *"La evaluación final la realiza el Dr. Lagos en consulta."* — no se da ninguna indicación clínica real basada en las respuestas, ya que esto es contenido de marketing, no diagnóstico médico.

## Imágenes

Se usan los placeholders de IA que ya trae el export de Stitch (hero, antes/después de pacientes), pero **descargados y servidos localmente** desde `assets/img/` en vez de apuntar a las URLs temporales de `lh3.googleusercontent.com` (que son parte de la sesión de Stitch y no están garantizadas a persistir). El logo real (proporcionado por el cliente) reemplaza el texto "LOGO" del nav y footer. Cuando el cliente tenga fotos reales del doctor/consultorio/pacientes, se reemplazan sin cambiar el layout.

## Formulario y WhatsApp — flujo

1. Validación en el cliente (JS): campos no vacíos, formato básico de teléfono.
2. `fetch()` a `form/enviar.php` (sin recargar la página).
3. `enviar.php` usa PHPMailer para enviar un correo a contacto@drhectorlagos.com con los datos, responde JSON `{ok: true/false}`.
4. Si `ok: true`: se abre `wa.me/573103300851` en pestaña nueva con mensaje precargado (`Hola, soy {nombre}, vivo en {ciudad}, quiero agendar mi valoración.`) y se muestra un mensaje de confirmación inline.
5. Si `ok: false`: se muestra error inline sin perder los datos ingresados.
6. El botón flotante de WhatsApp y los enlaces "Contactar por WhatsApp" ya existentes en el diseño abren `wa.me/573103300851` con un mensaje genérico predefinido.

## Tracking

Meta Pixel y Google Analytics 4 se agregan en el `<head>` de `index.html`, con el Pixel ID / Measurement ID como placeholders configurables (el cliente los provee luego). Eventos disparados:
- `Lead` (Meta) / evento de conversión (GA4) al enviar el formulario con éxito
- `Contact` (Meta) al hacer clic en cualquier enlace/botón de WhatsApp
- Evento custom `test_completado` al terminar el Test de Candidato

## Despliegue en Hostinger

1. Compilar Tailwind localmente (`npx tailwindcss -o assets/css/output.css --minify`).
2. Instalar PHPMailer vía Composer (`composer require phpmailer/phpmailer`) — se sube la carpeta `vendor/` resultante.
3. Subir `index.html`, `assets/`, `form/`, `vendor/` a `public_html` vía el Administrador de Archivos de hPanel (o FTP).
4. Configurar el email remitente en `form/enviar.php` (SMTP de Hostinger o `mail()` nativo de PHP, según qué entregue mejor a la bandeja de entrada).
5. Verificar que el dominio apunte al hosting y que el certificado SSL (gratis en Hostinger) esté activo.

## Fuera de alcance (por ahora)

- CMS/blog — no se requiere, es contenido estático.
- Multi-idioma — sitio solo en español.
- Backend de base de datos para leads — el email + WhatsApp cubre la necesidad actual; se puede agregar después (ej. Google Sheets vía Apps Script) si se requiere un registro centralizado.
- Fotos reales del doctor/pacientes — se usan placeholders hasta que el cliente las provea.
