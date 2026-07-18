# Cookie Consent Banner + Aviso de Privacidad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Block Meta Pixel and GA4 from loading until the visitor explicitly accepts a cookie banner, and back it with a real Aviso de Privacidad page.

**Architecture:** A new self-contained script (`assets/js/consent.js`) owns two things: (1) functions that inject the Meta Pixel and GA4 snippets into the DOM on demand, and (2) the show/hide/click wiring for a fixed bottom banner whose markup lives in `index.html`. The decision is persisted in `localStorage` under one key with two possible values. A second static page, `aviso-privacidad.html`, holds the legal content and is linked from the banner and the footer.

**Tech Stack:** Vanilla JS (ES2017, matches `assets/js/script.js` style — `const`/`let`, arrow functions, no framework), Tailwind CSS (existing `tailwind.config.js`, compiled via `npm run build:css`), static HTML.

## Global Constraints

- `localStorage` key: `cookie_consent`, values `'accepted'` or `'rejected'` — no other values, no granular per-category consent (spec explicitly scopes this out).
- Colors: banner background `bg-primary-container` (`#1b3022`) with `text-white`; "Aceptar" button `bg-secondary-container` (`#fdd79b`) with `text-on-secondary-container` (`#785c2b`); "Rechazar" button is an outline button (`border-white text-white`, transparent background) — same visual weight as "Aceptar", per spec.
- Contact email for exercising data rights: `dr.hectorlagos@gmail.com`.
- Clinic address (for the "responsable del tratamiento" section): Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013, Cali, Valle del Cauca.
- Existing conversion-tracking calls in `assets/js/script.js` (`fbq('track','Lead')`, `gtag('event','generate_lead')`, and the quiz/WhatsApp equivalents) are already guarded with `if (window.fbq)` / `if (window.gtag)` — they must NOT be modified by this plan; they already do the right thing once `consent.js` defines those globals.
- Static asset cache-busting: this project appends `?v=N` to asset URLs in `index.html` (currently `v=6`) and bumps `N` whenever a referenced file's content changes (see git history: "chore: bump asset cache-busting version to v=5"). Any asset whose content this plan changes must have its query param bumped to `v=7` in every place it's referenced.
- No automated browser-test harness exists in this project (Playwright is a listed `devDependency` but has zero config/usage — do not wire it up as part of this plan, that would be unrelated scope creep). Automated tests here use Node's built-in test runner (`node --test`) and only cover pure functions (see `assets/js/formUtils.test.js`, `assets/js/quiz.test.js`). `consent.js` is DOM/localStorage/network glue code with no extractable pure logic, so it is verified manually in a browser per the steps in each task below — this mirrors how the contact form's PHP anti-spam logic was verified earlier in this project (manual `php -S` + `curl` checks, no new test framework introduced).

---

### Task 1: Consent-gated Meta Pixel/GA4 loader + banner in `index.html`

**Files:**
- Create: `assets/js/consent.js`
- Modify: `index.html:15-36` (remove static Pixel/GA4 script blocks), `index.html:9` (cache-bust bump), body end (add banner markup + `<script>` tag)

**Interfaces:**
- Produces: `window.fbq` and `window.gtag` become defined only after `consent.js` decides to call `loadMetaPixel()`/`loadGA4()` (on explicit accept, or automatically if `localStorage.getItem('cookie_consent') === 'accepted'` from a prior visit). `assets/js/script.js` already consumes these via `if (window.fbq)` / `if (window.gtag)` guards — no changes needed there.
- Consumes: DOM elements `#cookie-banner`, `#cookie-accept`, `#cookie-reject` (created in this task, in `index.html`).

- [ ] **Step 1: Create `assets/js/consent.js`**

```js
// Cookie consent — gates Meta Pixel and GA4 behind an explicit accept/reject.
(function () {
  const CONSENT_KEY = 'cookie_consent';
  const PIXEL_ID = 'PIXEL_ID_PLACEHOLDER';
  const GA4_ID = 'G-XXXXXXXXXX';

  function loadMetaPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function loadGA4() {
    if (window.gtag) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  const banner = document.getElementById('cookie-banner');

  function showBanner() {
    if (!banner) return;
    banner.classList.remove('translate-y-full');
    banner.classList.add('translate-y-0');
    banner.setAttribute('aria-hidden', 'false');
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.add('translate-y-full');
    banner.classList.remove('translate-y-0');
    banner.setAttribute('aria-hidden', 'true');
  }

  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      loadMetaPixel();
      loadGA4();
      localStorage.setItem(CONSENT_KEY, 'accepted');
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      hideBanner();
    });
  }

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadMetaPixel();
    loadGA4();
  } else if (consent !== 'rejected') {
    showBanner();
  }
})();
```

- [ ] **Step 2: Remove the static Meta Pixel/GA4 blocks from `index.html`**

Delete lines 15-36 (the `<!-- Meta Pixel -->` comment through the closing `</script>` of the GA4 block), so `<style>...</style>` is immediately followed by `</head>`.

- [ ] **Step 3: Bump the CSS cache-bust version in `index.html:9`**

```html
<link rel="stylesheet" href="assets/css/output.css?v=7">
```

- [ ] **Step 4: Add the banner markup to `index.html`, right after `</footer>` and before the existing bottom `<script>` tags**

```html
<div id="cookie-banner" class="fixed bottom-0 inset-x-0 z-50 translate-y-full transition-transform duration-300 ease-out bg-primary-container text-white px-gutter py-5 shadow-lg" role="region" aria-label="Aviso de cookies" aria-hidden="true">
  <div class="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-sm text-center md:text-left">
      Usamos cookies propias y de terceros (Meta, Google) para mejorar tu experiencia y medir el rendimiento de nuestras campañas. Puedes conocer más en nuestro <a href="aviso-privacidad.html" class="underline hover:text-secondary-fixed">Aviso de Privacidad</a>.
    </p>
    <div class="flex gap-3 shrink-0">
      <button id="cookie-reject" type="button" class="border border-white text-white px-5 py-2 rounded-full font-label-sm hover:bg-white/10 transition-colors">Rechazar</button>
      <button id="cookie-accept" type="button" class="bg-secondary-container text-on-secondary-container px-5 py-2 rounded-full font-label-sm hover:opacity-90 transition-colors">Aceptar</button>
    </div>
  </div>
</div>
```

- [ ] **Step 5: Add the `consent.js` script tag, as the first of the bottom scripts, in `index.html`**

```html
<script src="assets/js/consent.js?v=7"></script>
<script src="assets/js/quiz.js?v=6"></script>
<script src="assets/js/formUtils.js?v=6"></script>
<script src="assets/js/script.js?v=6"></script>
```

- [ ] **Step 6: Rebuild the compiled CSS so the new Tailwind classes (`translate-y-full`, `translate-y-0`, `transition-transform`, etc.) exist in `output.css`**

Run: `npm run build:css`
Expected: exits 0, `assets/css/output.css` is rewritten (it's gitignored, so `git status` won't show it).

- [ ] **Step 7: Manually verify the accept path in a browser**

Run: `php -S localhost:8000` from the project root, then in a browser:
1. Open DevTools → Application → Local Storage, delete any `cookie_consent` key. Open DevTools → Network and filter by `facebook` / `google`.
2. Load `http://localhost:8000/index.html`. Expected: the banner slides up from the bottom; no requests to `connect.facebook.net` or `googletagmanager.com` appear in the Network tab.
3. Click **Aceptar**. Expected: the banner slides back down; requests to `connect.facebook.net/en_US/fbevents.js` and `googletagmanager.com/gtag/js?id=G-XXXXXXXXXX` now appear; `localStorage.getItem('cookie_consent')` (via the DevTools console) returns `"accepted"`.
4. Reload the page. Expected: banner does NOT reappear; the same tracking requests fire automatically on load.

- [ ] **Step 8: Manually verify the reject path**

In DevTools → Application → Local Storage, delete `cookie_consent` again. Reload the page, click **Rechazar**. Expected: banner slides down, `localStorage.getItem('cookie_consent')` returns `"rejected"`, and no tracking requests appear. Reload again. Expected: banner still does not reappear, and still no tracking requests.

- [ ] **Step 9: Confirm the contact form still works unaffected**

Submit the contact form with valid data (as in prior manual verification of `form/enviar.php`) and confirm the existing success flow (WhatsApp opens, success message shows) is unchanged — `consent.js` does not touch the form.

- [ ] **Step 10: Commit**

```bash
git add assets/js/consent.js index.html
git commit -m "$(cat <<'EOF'
feat: gate Meta Pixel and GA4 behind a cookie consent banner

Neither tracker loads until the visitor explicitly accepts; rejecting
(or not deciding) means fbq/gtag stay undefined, which the existing
conversion-tracking calls in script.js already guard against.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Aviso de Privacidad page

**Files:**
- Create: `aviso-privacidad.html`
- Modify: `index.html:314` (footer link), `index.html:298` (footer logo link), `README.md` (deploy file list), `tailwind.config.js:3` (add the new page to Tailwind's content scan)

**Interfaces:**
- Consumes: `assets/js/consent.js` (from Task 1) — included so a visitor who already accepted cookies on the homepage still gets Meta Pixel/GA4 on this page too. This page does NOT include the banner markup (no `#cookie-banner` element) — `consent.js`'s `showBanner()`/`hideBanner()` no-op safely when `banner` is `null` (see Task 1, Step 1), so a first-time visitor landing directly on this page simply gets no trackers and no banner; they'll see the banner when they visit the homepage.

- [ ] **Step 1: Create `aviso-privacidad.html`**

```html
<!doctype html>
<html class="scroll-smooth" lang="es">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Aviso de Privacidad | Dr. Héctor Lagos</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/output.css?v=7">
</head>
<body class="bg-surface font-body-md text-on-surface">
<header class="w-full py-6 border-b border-outline-variant/30">
  <div class="max-w-container-max mx-auto px-gutter flex items-center justify-between">
    <a href="index.html" class="flex items-center h-12">
      <img src="assets/img/logo-v2.png" alt="Dr. Héctor Lagos — Cirugía Bariátrica" class="h-full w-auto object-contain">
    </a>
    <a href="index.html" class="text-primary font-label-sm hover:text-secondary transition-colors">&larr; Volver al inicio</a>
  </div>
</header>

<main class="max-w-container-max mx-auto px-gutter py-16">
  <h1 class="font-headline-lg text-primary mb-2">Aviso de Privacidad</h1>
  <p class="text-on-surface-variant text-sm mb-10">Última actualización: 18 de julio de 2026</p>

  <div class="space-y-8 text-on-surface-variant text-body-md max-w-3xl">
    <section>
      <h2 class="font-headline-md text-primary mb-2">1. Responsable del tratamiento</h2>
      <p>El responsable del tratamiento de sus datos personales es el Dr. Héctor Lagos, con domicilio de atención en Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013, Cali, Valle del Cauca, Colombia.</p>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">2. Datos que recolectamos</h2>
      <p>A través de este sitio recolectamos dos tipos de datos:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li>Los que usted nos entrega voluntariamente al diligenciar el formulario de contacto: nombre completo, número de WhatsApp y ciudad de residencia.</li>
        <li>Datos de navegación recolectados mediante cookies de Meta (Facebook/Instagram) y Google Analytics, únicamente después de que usted da su consentimiento en el aviso de cookies.</li>
      </ul>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">3. Finalidad del tratamiento</h2>
      <p>Los datos del formulario se usan exclusivamente para contactarlo y coordinar su cita o valoración médica. Los datos de navegación se usan para medir el rendimiento de nuestras campañas publicitarias en Meta y Google, y para entender cómo los visitantes usan este sitio.</p>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">4. Fundamento legal</h2>
      <p>El tratamiento de sus datos personales se realiza de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia, que regulan la protección de datos personales (Habeas Data).</p>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">5. Derechos del titular</h2>
      <p>Como titular de los datos, usted tiene derecho a:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li>Conocer, actualizar y rectificar sus datos personales.</li>
        <li>Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.</li>
        <li>Ser informado sobre el uso que se le ha dado a sus datos.</li>
        <li>Revocar la autorización y/o solicitar la supresión de sus datos cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
        <li>Acceder de forma gratuita a sus datos personales.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la normativa de protección de datos.</li>
      </ul>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">6. Cómo ejercer sus derechos</h2>
      <p>Para ejercer cualquiera de estos derechos, puede escribirnos a <a href="mailto:dr.hectorlagos@gmail.com" class="text-primary underline hover:text-secondary">dr.hectorlagos@gmail.com</a> indicando su solicitud. Responderemos dentro de los términos establecidos por la ley.</p>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">7. Terceros con quienes compartimos datos</h2>
      <p>Los datos de navegación (cookies) son procesados por Meta Platforms, Inc. (Meta Pixel) y Google LLC (Google Analytics), únicamente con fines de medición publicitaria y analítica. Puede rechazar estas cookies en cualquier momento desde el aviso que aparece al ingresar al sitio.</p>
    </section>

    <section>
      <h2 class="font-headline-md text-primary mb-2">8. Cambios a este aviso</h2>
      <p>Este aviso de privacidad puede actualizarse en cualquier momento. La fecha de la última actualización se indica al inicio de este documento.</p>
    </section>
  </div>
</main>

<footer class="w-full py-12 bg-surface-container-high border-t border-outline-variant/30">
  <div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="space-y-4">
      <a href="index.html" class="block h-10">
        <img src="assets/img/logo-v2.png" alt="Dr. Héctor Lagos" class="h-full w-auto object-contain">
      </a>
      <p class="text-body-md text-on-surface-variant pr-8">Especialista en Cirugía Bariátrica y Metabólica. Transformando vidas a través de la excelencia médica y humana.</p>
      <div class="flex gap-4 pt-2">
        <a href="https://www.instagram.com/dr.hectorlagos" target="_blank" rel="noopener" aria-label="Instagram" class="text-secondary hover:text-primary transition-colors">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
        </a>
        <a href="https://www.facebook.com/drhectorlagos" target="_blank" rel="noopener" aria-label="Facebook" class="text-secondary hover:text-primary transition-colors">
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"></path></svg>
        </a>
      </div>
    </div>
    <div class="space-y-4">
      <h4 class="font-bold text-primary">Enlaces</h4>
      <ul class="space-y-2">
        <li><a class="text-on-surface-variant hover:text-primary hover:underline transition-all" href="aviso-privacidad.html">Aviso de Privacidad</a></li>
        <li><a class="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Términos de Servicio</a></li>
      </ul>
    </div>
    <div class="space-y-4">
      <h4 class="font-bold text-primary">Contacto</h4>
      <p class="text-on-surface-variant">Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013<br>Cali, Valle del Cauca</p>
      <p class="text-on-surface-variant">dr.hectorlagos@gmail.com</p>
      <p class="text-on-surface-variant">Lun - Vie: 8:00 AM - 6:00 PM<br>Sábados: 9:00 AM - 1:00 PM</p>
    </div>
  </div>
  <div class="max-w-container-max mx-auto px-gutter mt-12 pt-8 border-t border-outline-variant/30 text-center md:text-left">
    <p class="text-body-md text-on-surface-variant text-sm">© 2026 Dr. Héctor Lagos. Especialista en Cirugía Bariátrica. Todos los derechos reservados.</p>
  </div>
</footer>
<script src="assets/js/consent.js?v=7"></script>
</body>
</html>
```

- [ ] **Step 2: Add `aviso-privacidad.html` to Tailwind's content scan, in `tailwind.config.js:3`**

Tailwind's JIT compiler only generates utility classes for files listed in `content` — right now that's `["./index.html", "./assets/js/**/*.js"]`. Without this change, any class used only in `aviso-privacidad.html` (not already present in `index.html`) silently won't exist in the compiled `output.css`.

```js
content: ["./index.html", "./aviso-privacidad.html", "./assets/js/**/*.js"],
```

- [ ] **Step 3: Rebuild the compiled CSS so classes used only in `aviso-privacidad.html` are included**

Run: `npm run build:css`
Expected: exits 0, `assets/css/output.css` is rewritten.

- [ ] **Step 4: Point the homepage footer's privacy link at the new page, in `index.html:314`**

```html
<li><a class="text-on-surface-variant hover:text-primary hover:underline transition-all" href="aviso-privacidad.html">Aviso de Privacidad</a></li>
```

- [ ] **Step 5: Point the homepage footer logo at `index.html` instead of `#`, in `index.html:298`**

```html
<a href="index.html" class="block h-10">
```

- [ ] **Step 6: Add the new page to the Hostinger upload list in `README.md`**

Find the bullet list under "Subir a Hostinger (hosting compartido)" (currently starts with `- \`index.html\``) and add a line right after it:

```markdown
- `index.html`
- `aviso-privacidad.html`
```

- [ ] **Step 7: Manually verify in a browser**

With `php -S localhost:8000` still running from Task 1:
1. Open `http://localhost:8000/index.html`, scroll to the footer, click "Aviso de Privacidad". Expected: navigates to `aviso-privacidad.html`, all 8 sections render, styling matches the rest of the site (same fonts/colors).
2. Click "Volver al inicio" (or the logo). Expected: navigates back to `index.html`.
3. Resize the browser (or use DevTools device toolbar) to a 375px-wide viewport on `aviso-privacidad.html`. Expected: header, headings, and footer reflow correctly, no horizontal overflow.
4. With `cookie_consent` set to `accepted` in Local Storage (from Task 1's Step 7), reload `aviso-privacidad.html` directly. Expected: Network tab shows the Meta Pixel/GA4 requests firing automatically (no banner appears on this page since it has no banner markup — that's expected per this task's Interfaces note).

- [ ] **Step 8: Commit**

```bash
git add aviso-privacidad.html index.html README.md tailwind.config.js
git commit -m "$(cat <<'EOF'
feat: add Aviso de Privacidad page, link it from the footer

Backs the new cookie consent banner with the actual privacy notice
required by Colombia's Ley 1581 de 2012 (Habeas Data).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
