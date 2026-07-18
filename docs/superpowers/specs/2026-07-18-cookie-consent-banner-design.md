# Banner de consentimiento de cookies + Aviso de Privacidad

## Contexto

La landing ya tiene el código de Meta Pixel y Google Analytics 4 (GA4) conectado en `index.html` (líneas 15-35), pero con IDs de ejemplo (`PIXEL_ID_PLACEHOLDER`, `G-XXXXXXXXXX`) — todavía no capturan datos reales. Cuando el Dr. Lagos entregue los IDs reales para correr campañas de Meta, esos scripts empezarán a poner cookies de rastreo en el navegador de cada visitante sin que exista ningún aviso ni forma de rechazarlo.

El footer ya incluye un enlace "Aviso de Privacidad" (`index.html:310`) que hoy apunta a `#` — no hay página real detrás.

Este documento define un banner de cookies que bloquea la carga de Meta Pixel/GA4 hasta que el visitante decide, y una página de Aviso de Privacidad real para respaldarlo.

## Objetivo

1. No cargar Meta Pixel ni GA4 hasta que el visitante acepte explícitamente.
2. Dar al visitante una opción real de "Rechazar" con el mismo peso visual que "Aceptar".
3. Explicar en un Aviso de Privacidad qué datos se recolectan (formulario + cookies), para qué, y cómo ejercer los derechos que da la Ley 1581 de 2012 (Habeas Data, Colombia).
4. No romper el tracking de conversiones que ya existe en `assets/js/script.js` (eventos `Lead`, `TestCompletado`, `Contact` disparados vía `fbq`/`gtag`).

## Fuera de alcance

- No se implementa un panel de "preferencias granulares" (cookies de analítica vs. marketing por separado) — solo Aceptar/Rechazar global. El sitio no usa más cookies que Meta Pixel y GA4.
- No se reemplazan los IDs placeholder de Meta Pixel/GA4 — eso sigue pendiente de que el Dr. Lagos entregue los IDs reales (ver README, sección "Antes de desplegar").
- No se traduce el aviso a inglés ni se contempla tráfico fuera de Colombia.

## Banner de cookies

**Copy:**

> Usamos cookies propias y de terceros (Meta, Google) para mejorar tu experiencia y medir el rendimiento de nuestras campañas. Puedes conocer más en nuestro [Aviso de Privacidad]. — **[Rechazar]** **[Aceptar]**

**Diseño visual:** barra fija en la parte inferior de la pantalla (`position: fixed; bottom: 0`), ancho completo, con los colores institucionales ya usados en el resto del sitio:
- Fondo `#1b3022` (verde oscuro, el mismo del header de los correos de lead y de `bg-primary-container`).
- Texto en blanco.
- Botón "Aceptar": fondo dorado `#755a29` o `#fdd79b`, texto oscuro — mismo tratamiento que los botones CTA del sitio (`rounded-full`, `font-label-sm`).
- Botón "Rechazar": outline (borde blanco/dorado, fondo transparente), mismo tamaño que "Aceptar" — ambas acciones con el mismo peso visual, ninguna se oculta ni se hace más pequeña.
- El enlace "Aviso de Privacidad" dentro del texto apunta a `aviso-privacidad.html`.

**Comportamiento:**
- Al cargar la página, si no hay una decisión guardada, el banner aparece con una transición CSS simple (`translateY` desde fuera de la pantalla hacia su posición final). No depende del scroll — aparece de inmediato, a diferencia del patrón `reveal-on-scroll` que ya usa el resto del sitio para secciones.
- Si ya existe una decisión guardada (`localStorage`), el banner nunca se muestra.
- El banner no bloquea la interacción con el resto de la página (no hay overlay ni se deshabilita el scroll).

## Aviso de Privacidad (`aviso-privacidad.html`)

Página HTML nueva, independiente de `index.html`, con:

- **Header simplificado:** logo/nombre de la clínica, sin la navegación de anclas (no aplica en esta página), con un enlace "Volver al inicio" hacia `index.html`.
- **Footer:** el mismo footer de `index.html` (dirección, redes sociales, horarios), para mantener consistencia de marca y que el visitante siempre tenga los datos de contacto a mano.
- **Contenido** (secciones, en este orden):
  1. Responsable del tratamiento — Dr. Héctor Lagos, Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013, Cali.
  2. Datos que se recolectan — los del formulario de contacto (nombre, WhatsApp, ciudad) y datos de navegación vía cookies (Meta Pixel, Google Analytics).
  3. Finalidad — contactar al paciente y agendar citas; medir la efectividad de campañas publicitarias en Meta/Google.
  4. Fundamento legal — Ley 1581 de 2012 (Habeas Data, Colombia).
  5. Derechos del titular — conocer, actualizar, rectificar sus datos; solicitar prueba de la autorización otorgada; ser informado sobre el uso dado a sus datos; revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios legales; acceder gratuitamente a sus datos; presentar quejas ante la Superintendencia de Industria y Comercio (SIC).
  6. Canal de contacto para ejercer estos derechos — `dr.hectorlagos@gmail.com`.
  7. Terceros con quienes se comparten datos — Meta/Facebook (Meta Pixel) y Google (Analytics), y el motivo (medición de campañas).
  8. Fecha de última actualización del aviso.

Estilo visual: tipografía y colores consistentes con el resto del sitio (Playfair Display para títulos, Work Sans para cuerpo, mismo `tailwind.config.js`), sin necesidad de clases nuevas.

## Mecanismo técnico de bloqueo

**`assets/js/consent.js`** (nuevo archivo):

```
CONSENT_KEY = 'cookie_consent'   // valores: 'accepted' | 'rejected'

al cargar:
  valor = localStorage.getItem(CONSENT_KEY)
  si valor === 'accepted':
    loadMetaPixel(); loadGA4()
  si no hay valor:
    mostrar banner
    click "Aceptar"  -> loadMetaPixel(); loadGA4(); localStorage.setItem('accepted'); ocultar banner
    click "Rechazar" -> localStorage.setItem('rejected'); ocultar banner
  // si valor === 'rejected', no se hace nada más

loadMetaPixel():
  inyecta dinámicamente en el DOM el snippet estándar de Meta Pixel
  (define window.fbq, agrega <script async src="https://connect.facebook.net/...">,
   llama fbq('init', PIXEL_ID) y fbq('track', 'PageView'))

loadGA4():
  inyecta dinámicamente <script async src="https://www.googletagmanager.com/gtag/js?id=...">
  y el script que define window.gtag, llama gtag('js', ...) y gtag('config', GA4_ID)
```

Los IDs (`PIXEL_ID_PLACEHOLDER`, `G-XXXXXXXXXX`) se mueven a este archivo como constantes, reemplazando a los bloques `<script>` que hoy están hardcodeados y se autoejecutan en `index.html:15-35`. Esos bloques se eliminan de `index.html`.

**Por qué no hace falta tocar `script.js`:** los eventos de conversión que ya existen (`fbq('track','Lead')` en la línea 180, `gtag('event','generate_lead')` en la 181, y los de `TestCompletado`/`Contact`) están todos protegidos con `if (window.fbq)` / `if (window.gtag)`. Si el visitante rechazó cookies, esas variables no existen y esas líneas simplemente no hacen nada — no hay ninguna llamada que vaya a fallar.

**Cambios en `index.html`:**
- Se eliminan los bloques `<script>` de Meta Pixel/GA4 actuales.
- Se agrega `<script src="assets/js/consent.js" defer>`.
- Se agrega el markup del banner (oculto por defecto, se muestra vía JS) antes de `</body>`.
- El enlace del footer "Aviso de Privacidad" cambia de `href="#"` a `href="aviso-privacidad.html"`.

## Verificación

1. Con `localStorage` limpio, cargar la página → el banner debe aparecer y no debe haber ninguna petición de red hacia `googletagmanager.com` ni `connect.facebook.net` (verificar en DevTools → Network).
2. Clic en "Aceptar" → deben aparecer esas peticiones de red, y `localStorage.getItem('cookie_consent')` debe ser `'accepted'`. Recargar la página → el banner no debe volver a aparecer y las peticiones deben seguir apareciendo automáticamente.
3. Con `localStorage` limpio de nuevo, clic en "Rechazar" → no debe haber peticiones de red hacia esos dominios, `localStorage.getItem('cookie_consent')` debe ser `'rejected'`, y el banner no debe reaparecer al recargar.
4. Confirmar que el formulario de contacto sigue funcionando igual (el envío de lead por email no depende de `consent.js`).
5. Revisar visualmente el banner y `aviso-privacidad.html` en desktop y en viewport móvil (375px), siguiendo el mismo criterio mobile-first del resto del sitio.
