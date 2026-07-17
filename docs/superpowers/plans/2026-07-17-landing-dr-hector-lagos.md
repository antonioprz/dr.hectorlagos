# Landing Dr. Héctor Lagos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, one-page landing site for Dr. Héctor Lagos (bariatric surgeon) — static HTML/Tailwind/JS with a PHP form handler — deployable to Hostinger shared hosting, replicating the Stitch export with real business data wired in.

**Architecture:** A single `index.html` with anchor-linked sections, styled by a locally-compiled Tailwind build (no CDN in production), interactive behavior in small dual-environment (browser + Node-testable) vanilla JS modules, and a PHP endpoint (`form/enviar.php`) that validates input and sends email via PHPMailer. No server-side build step — everything ships as static files + PHP.

**Tech Stack:** HTML5, Tailwind CSS (CLI build, v3), vanilla JS (`node:test` for unit tests), PHP 8 + PHPMailer (Composer), Google Fonts, Material Symbols.

## Global Constraints

- WhatsApp number (all `wa.me` links and floating button): `+573103300851`
- Contact email (form recipient + footer): `contacto@drhectorlagos.com`
- Address (footer + contact section): `Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013, Cali, Valle del Cauca`
- Design tokens (colors, type, spacing, radii) come from `C:\Users\Administrador\Downloads\DR\stitch_tu_nuevo_comienzo_digital\DESIGN.md` — copy values verbatim, do not invent new ones.
- Tailwind must be a **compiled build**, never the `cdn.tailwindcss.com` script tag, in the shipped `index.html`.
- Site is one page with anchors: `#beneficios`, `#test`, `#historias`, `#contacto`. No routing, no CMS, no multi-language.
- The "Test de Candidato" has exactly 4 steps (age, weight situation, prior attempts, health conditions) and **always** ends on a positive result with the disclaimer "La evaluación final la realiza el Dr. Lagos en consulta." — never a clinical diagnosis.
- Real patient/doctor photos are not available yet — use local static placeholder assets (never hotlink the temporary `lh3.googleusercontent.com` Stitch URLs).
- Target host is Hostinger shared hosting (hPanel/cPanel-style): no guaranteed Node/Composer on the server — all builds happen locally, only static output + `vendor/` are uploaded.
- Real logo file: `C:\Users\Administrador\Downloads\DR\Mesa de trabajo 1 copia 7@2x.png` (has alpha transparency, confirmed via PNG header — safe on any background color).
- **Mobile-first:** most visitors arrive from Instagram/social media on a phone. Every section must work at a 375px-wide viewport, not just desktop. The nav hamburger menu must be a fully working toggle (not decorative), tap targets (quiz options, buttons, form fields) must be comfortably tappable, and the floating WhatsApp button must never overlap or block other content on small screens. Every browser-verification step in this plan includes an explicit mobile-viewport check — do not skip it.

---

### Task 1: Project scaffolding & Tailwind build pipeline

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `assets/css/input.css`
- Create: `.gitignore`
- Test: manual (build output inspection, no automated test framework needed for build config)

**Interfaces:**
- Produces: `npm run build:css` command that later tasks rely on to generate `assets/css/output.css` before every browser check.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "landing-dr-hector-lagos",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build:css": "tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify",
    "watch:css": "tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch",
    "test:js": "node --test assets/js/*.test.js"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/container-queries": "^0.1.1"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no errors, `package-lock.json` generated.

- [ ] **Step 3: Create `tailwind.config.js` with the Stitch design tokens**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error-container": "#93000a",
        "on-secondary": "#ffffff",
        "on-background": "#1b1c1c",
        "surface-dim": "#dbd9d9",
        "inverse-surface": "#303030",
        "inverse-on-surface": "#f2f0f0",
        "tertiary-fixed-dim": "#c9c6c1",
        "on-primary-fixed-variant": "#364c3c",
        "surface-tint": "#4d6453",
        "tertiary-fixed": "#e5e2dc",
        "inverse-primary": "#b4cdb8",
        "outline": "#737973",
        "surface-container-low": "#f5f3f3",
        "surface": "#fbf9f8",
        "primary-container": "#1b3022",
        "error-container": "#ffdad6",
        "on-tertiary-container": "#95938e",
        "tertiary-container": "#2c2c28",
        "primary": "#061b0e",
        "surface-container-highest": "#e4e2e2",
        "primary-fixed": "#d0e9d4",
        "error": "#ba1a1a",
        "secondary-fixed": "#ffdeaa",
        "background": "#fbf9f8",
        "secondary-container": "#fdd79b",
        "surface-container-high": "#eae8e7",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#e5c186",
        "on-tertiary": "#ffffff",
        "surface-variant": "#e4e2e2",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#271900",
        "on-secondary-container": "#785c2b",
        "on-primary-fixed": "#0b2013",
        "on-error": "#ffffff",
        "outline-variant": "#c3c8c1",
        "on-surface": "#1b1c1c",
        "surface-container": "#efeded",
        "on-secondary-fixed-variant": "#5b4214",
        "on-surface-variant": "#434843",
        "surface-bright": "#fbf9f8",
        "on-tertiary-fixed": "#1c1c18",
        "on-primary-container": "#819986",
        "secondary": "#755a29",
        "primary-fixed-dim": "#b4cdb8",
        "tertiary": "#171814",
        "on-tertiary-fixed-variant": "#474743"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-max": "1200px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        base: "8px"
      },
      fontFamily: {
        "headline-lg": ["Playfair Display", "serif"],
        "body-md": ["Work Sans", "sans-serif"],
        "label-sm": ["Work Sans", "sans-serif"],
        "body-lg": ["Work Sans", "sans-serif"],
        "headline-lg-mobile": ["Playfair Display", "serif"],
        "display-lg": ["Playfair Display", "serif"],
        "headline-md": ["Playfair Display", "serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }]
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")]
};
```

- [ ] **Step 4: Create `assets/css/input.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .glass-card {
    background: rgba(251, 249, 248, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(117, 90, 41, 0.1);
  }
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease-out;
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }
  .scroll-progress {
    height: 3px;
    background: #755a29;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 100;
    width: 0%;
    transition: width 0.1s linear;
  }
}
```

- [ ] **Step 5: Create a temporary `index.html` stub so Tailwind has content to scan**

```html
<!doctype html>
<html><body class="bg-primary text-on-primary"><p class="font-display-lg">stub</p></body></html>
```

- [ ] **Step 6: Run the build and verify the compiled output contains the custom tokens**

Run: `npm run build:css`
Expected: `assets/css/output.css` is created with no errors.

Run: `grep -c "background-color: #061b0e" assets/css/output.css`
Expected: a number `1` or greater (confirms the `primary` custom color compiled correctly).

- [ ] **Step 7: Create `.gitignore`**

```
node_modules/
vendor/
assets/css/output.css
form/config.php
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tailwind.config.js assets/css/input.css .gitignore index.html
git commit -m "chore: scaffold Tailwind build pipeline"
```

---

### Task 2: Static shell — head, nav, hero, footer

**Files:**
- Modify: `index.html` (replace stub with real document)
- Create: `assets/img/logo.png` (copied from client-provided file)
- Create: `assets/img/hero-placeholder.svg`
- Create: `assets/js/script.js` (starts with the mobile nav menu toggle; Tasks 5, 9, and 10 append to this same file)

**Interfaces:**
- Produces: the `<head>` block (fonts, compiled CSS link, meta tags) and page skeleton (`<nav>`, `<section id="hero">`, `<footer>`) that every later task inserts sections into, between the hero `</section>` and the `<footer>` tag. Also produces `assets/js/script.js` with a working mobile menu toggle — Tasks 5, 9, and 10 append their own IIFEs to the end of this file, they do not create a new one.

- [ ] **Step 1: Copy the real logo into the project**

Run:
```bash
cp "C:/Users/Administrador/Downloads/DR/Mesa de trabajo 1 copia 7@2x.png" "assets/img/logo.png"
```
Expected: `assets/img/logo.png` exists and is non-empty (`ls -la assets/img/logo.png` shows a size > 0).

- [ ] **Step 2: Create a local hero placeholder image (no external network dependency)**

Create `assets/img/hero-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d0e9d4"/>
      <stop offset="100%" stop-color="#fdd79b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <text x="600" y="450" text-anchor="middle" font-family="Work Sans, sans-serif" font-size="32" fill="#061b0e">
    Foto próximamente
  </text>
</svg>
```

- [ ] **Step 3: Write the document head and nav in `index.html`**

```html
<!doctype html>
<html class="scroll-smooth" lang="es">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Dr. Héctor Lagos | Cirugía Bariátrica Transformacional</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/output.css">
<style>
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  }
</style>
</head>
<body class="bg-surface font-body-md text-on-surface">
<div class="scroll-progress" id="progress-bar"></div>
<nav class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
  <div class="max-w-container-max mx-auto px-gutter flex justify-between items-center h-20">
    <a href="#" class="flex items-center h-12">
      <img src="assets/img/logo.png" alt="Dr. Héctor Lagos — Cirugía Bariátrica" class="h-full w-auto object-contain">
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#beneficios">Beneficios</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#historias">Historias</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#test">Test</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#contacto">Contacto</a>
      <a class="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-sm hover:opacity-90 transition-all active:scale-95" href="#contacto">Agendar Cita</a>
    </div>
    <button class="md:hidden text-primary p-2" id="mobile-menu-button" aria-expanded="false" aria-controls="mobile-menu">
      <span class="material-symbols-outlined" id="mobile-menu-icon">menu</span>
    </button>
  </div>
  <div class="hidden md:hidden flex flex-col gap-1 px-gutter pb-6 bg-surface" id="mobile-menu">
    <a class="py-3 text-on-surface-variant border-b border-outline-variant/30" href="#beneficios">Beneficios</a>
    <a class="py-3 text-on-surface-variant border-b border-outline-variant/30" href="#historias">Historias</a>
    <a class="py-3 text-on-surface-variant border-b border-outline-variant/30" href="#test">Test</a>
    <a class="py-3 text-on-surface-variant border-b border-outline-variant/30" href="#contacto">Contacto</a>
    <a class="mt-4 text-center bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-sm" href="#contacto">Agendar Cita</a>
  </div>
</nav>
```

- [ ] **Step 4: Create `assets/js/script.js` with the mobile menu toggle**

```js
// Mobile nav menu toggle
(function () {
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('mobile-menu-icon');
  if (!button || !menu) return;

  button.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    button.setAttribute('aria-expanded', String(!isOpen));
    icon.textContent = isOpen ? 'menu' : 'close';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      icon.textContent = 'menu';
    });
  });
})();
```

- [ ] **Step 5: Write the hero section**

```html
<section class="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
  <div class="absolute inset-0 z-0">
    <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10"></div>
    <img src="assets/img/hero-placeholder.svg" alt="Persona caminando, representando vitalidad y un nuevo comienzo" class="w-full h-full object-cover object-center">
  </div>
  <div class="relative z-20 max-w-container-max mx-auto px-gutter w-full">
    <div class="max-w-2xl space-y-6">
      <h1 class="font-display-lg text-primary leading-tight">
        No estás buscando bajar de peso. Estás buscando <span class="italic text-secondary">volver a vivir.</span>
      </h1>
      <p class="text-body-lg text-on-surface-variant">
        Agenda una valoración personalizada con el Dr. Héctor Lagos y descubre si la cirugía bariátrica es la mejor opción para transformar tu salud definitivamente.
      </p>
      <div class="flex flex-wrap gap-4 pt-4">
        <a class="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2" href="#contacto">
          Agendar valoración
          <span class="material-symbols-outlined text-sm">calendar_today</span>
        </a>
        <a class="whatsapp-link border-2 border-secondary text-secondary px-8 py-4 rounded-full font-label-sm hover:bg-secondary/5 transition-all flex items-center gap-2" href="#" data-wa-message="Hola, quiero agendar una consulta.">
          Contactar por WhatsApp
          <span class="material-symbols-outlined text-sm">chat</span>
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Write the footer, wire the script tag, and close the document**

```html
<footer class="w-full py-12 bg-surface-container-high border-t border-outline-variant/30">
  <div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="space-y-4">
      <a href="#" class="block h-10">
        <img src="assets/img/logo.png" alt="Dr. Héctor Lagos" class="h-full w-auto object-contain">
      </a>
      <p class="text-body-md text-on-surface-variant pr-8">Especialista en Cirugía Bariátrica y Metabólica. Transformando vidas a través de la excelencia médica y humana.</p>
    </div>
    <div class="space-y-4">
      <h4 class="font-bold text-primary">Enlaces</h4>
      <ul class="space-y-2">
        <li><a class="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Aviso de Privacidad</a></li>
        <li><a class="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Términos de Servicio</a></li>
      </ul>
    </div>
    <div class="space-y-4">
      <h4 class="font-bold text-primary">Contacto</h4>
      <p class="text-on-surface-variant">Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013<br>Cali, Valle del Cauca</p>
      <p class="text-on-surface-variant">contacto@drhectorlagos.com</p>
      <p class="text-on-surface-variant">Lun - Vie: 8:00 AM - 6:00 PM<br>Sábados: 9:00 AM - 1:00 PM</p>
    </div>
  </div>
  <div class="max-w-container-max mx-auto px-gutter mt-12 pt-8 border-t border-outline-variant/30 text-center md:text-left">
    <p class="text-body-md text-on-surface-variant text-sm">© 2026 Dr. Héctor Lagos. Especialista en Cirugía Bariátrica. Todos los derechos reservados.</p>
  </div>
</footer>
<script src="assets/js/script.js"></script>
</body>
</html>
```

- [ ] **Step 7: Rebuild CSS and verify in browser, desktop and mobile**

Run: `npm run build:css`
Run: `php -S localhost:8000` (from the project root, in a separate terminal)
Open `http://localhost:8000/index.html` in a browser at normal desktop width.
Expected: nav bar with real logo image visible (not broken image icon), hero headline in serif font with green/gold coloring, gradient placeholder image behind the hero text, footer with real address/email. No console errors in devtools.

Then open devtools, switch to responsive/device mode at 375px width (e.g. "iPhone SE").
Expected: the desktop nav links disappear and only the logo + hamburger button show; tapping the hamburger reveals the mobile menu panel (Beneficios/Historias/Test/Contacto/Agendar Cita stacked vertically) and the icon changes from `menu` to `close`; tapping a link or the hamburger again closes it; the hero headline and buttons stack in a single readable column with no horizontal overflow/scrollbar.

- [ ] **Step 8: Commit**

```bash
git add index.html assets/img/logo.png assets/img/hero-placeholder.svg assets/js/script.js
git commit -m "feat: add responsive page shell with working mobile nav menu"
```

---

### Task 3: Beneficios + Historias sections (static content)

**Files:**
- Modify: `index.html` (insert both sections between hero and footer)
- Create: `assets/img/testimonial-1.svg`, `assets/img/testimonial-2.svg`, `assets/img/testimonial-3.svg`

**Interfaces:**
- Consumes: page shell from Task 2 (insert content right after the hero `</section>`, before `<footer>`).

- [ ] **Step 1: Create the 3 testimonial placeholder images**

Create `assets/img/testimonial-1.svg` (repeat the same pattern for `testimonial-2.svg` and `testimonial-3.svg`, changing only the label text to `"Historia de paciente 2"` / `"Historia de paciente 3"`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#eae8e7"/>
  <rect x="0" y="0" width="800" height="1000" fill="none" stroke="#755a29" stroke-width="2"/>
  <text x="400" y="500" text-anchor="middle" font-family="Work Sans, sans-serif" font-size="28" fill="#061b0e">
    Historia de paciente 1
  </text>
</svg>
```

- [ ] **Step 2: Insert the "Beneficios" (autodiagnóstico) section into `index.html`, right after the hero `</section>`**

```html
<section class="py-24 bg-surface-container-low" id="beneficios">
  <div class="max-w-container-max mx-auto px-gutter">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <span class="font-label-sm text-secondary uppercase tracking-[0.2em] mb-4 block">Autodiagnóstico</span>
      <h2 class="font-headline-lg text-primary">¿Te identificas con esto?</h2>
      <p class="text-body-md text-on-surface-variant mt-4">Muchos de nuestros pacientes llegaron aquí sintiendo las mismas limitaciones. Reconocerlas es el primer paso del cambio.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:border-secondary transition-all">
        <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
          <span class="material-symbols-outlined text-3xl">stairs</span>
        </div>
        <h3 class="font-headline-md text-primary mb-3">Me canso al subir escaleras</h3>
        <p class="text-on-surface-variant">La fatiga constante limita tus actividades diarias más simples y necesarias.</p>
      </div>
      <div class="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:border-secondary transition-all">
        <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
          <span class="material-symbols-outlined text-3xl">restaurant</span>
        </div>
        <h3 class="font-headline-md text-primary mb-3">He intentado muchas dietas</h3>
        <p class="text-on-surface-variant">Sientes frustración al ver que los métodos convencionales no ofrecen resultados sostenibles.</p>
      </div>
      <div class="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:border-secondary transition-all">
        <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
          <span class="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
        </div>
        <h3 class="font-headline-md text-primary mb-3">Tengo miedo de operarme</h3>
        <p class="text-on-surface-variant">Es natural sentir temor, pero la información correcta y el acompañamiento experto lo cambian todo.</p>
      </div>
      <div class="glass-card p-8 rounded-xl flex flex-col md:flex-row items-center gap-6 lg:col-span-2 group hover:border-secondary transition-all">
        <div class="w-20 h-20 bg-secondary/10 rounded-full flex-shrink-0 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
          <span class="material-symbols-outlined text-4xl">favorite</span>
        </div>
        <div>
          <h3 class="font-headline-md text-primary mb-2">Quiero mejorar mi salud</h3>
          <p class="text-on-surface-variant">Buscas reducir el riesgo de diabetes, hipertensión y mejorar tu longevidad y calidad de vida para ti y tu familia.</p>
        </div>
      </div>
      <div class="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:border-secondary transition-all">
        <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
          <span class="material-symbols-outlined text-3xl">face_6</span>
        </div>
        <h3 class="font-headline-md text-primary mb-3">Quiero volver a sentirme bien</h3>
        <p class="text-on-surface-variant">Recuperar la confianza frente al espejo y la seguridad en tu propia piel.</p>
      </div>
    </div>
    <div class="mt-12 text-center">
      <a href="#contacto" class="inline-block bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-sm shadow-lg hover:shadow-xl transition-all active:scale-95">Hablar con un especialista</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Insert the "Historias" (testimonials) section right after the Beneficios `</section>`**

```html
<section class="py-24 bg-surface-container-low" id="historias">
  <div class="max-w-container-max mx-auto px-gutter">
    <div class="mb-12">
      <h2 class="font-display-lg text-primary mb-2">Historias que inspiran</h2>
      <p class="text-body-lg text-on-surface-variant">Nuestros pacientes comparten su proceso de renacimiento y salud.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div class="relative">
          <img src="assets/img/testimonial-1.svg" alt="Historia de paciente" class="w-full aspect-[4/5] object-cover">
          <div class="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-md">
            <span class="text-white font-bold text-xs tracking-wider">-45KG PERDIDOS</span>
          </div>
        </div>
        <div class="p-8 flex-grow flex flex-col">
          <div class="flex text-secondary mb-4">
            <span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span>
          </div>
          <p class="text-body-md italic text-on-surface-variant mb-6 flex-grow">"Cambió mi vida por completo. Volví a jugar con mis hijos sin cansarme. Gracias al Dr. Lagos por su empatía y acompañamiento."</p>
          <p class="font-bold text-primary">María Fernanda G.</p>
        </div>
      </div>
      <div class="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div class="relative">
          <img src="assets/img/testimonial-2.svg" alt="Historia de paciente" class="w-full aspect-[4/5] object-cover">
          <div class="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-md">
            <span class="text-white font-bold text-xs tracking-wider">-38KG PERDIDOS</span>
          </div>
        </div>
        <div class="p-8 flex-grow flex flex-col">
          <div class="flex text-secondary mb-4">
            <span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span>
          </div>
          <p class="text-body-md italic text-on-surface-variant mb-6 flex-grow">"El proceso fue mucho más sencillo de lo que imaginé. La recuperación fue rapidísima y el apoyo nutricional es la clave del éxito."</p>
          <p class="font-bold text-primary">Carlos Alberto R.</p>
        </div>
      </div>
      <div class="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div class="relative">
          <img src="assets/img/testimonial-3.svg" alt="Historia de paciente" class="w-full aspect-[4/5] object-cover">
          <div class="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-md">
            <span class="text-white font-bold text-xs tracking-wider">-52KG PERDIDOS</span>
          </div>
        </div>
        <div class="p-8 flex-grow flex flex-col">
          <div class="flex text-secondary mb-4">
            <span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span><span class="material-symbols-outlined text-sm">star</span>
          </div>
          <p class="text-body-md italic text-on-surface-variant mb-6 flex-grow">"Mi salud es otra. Ya no tengo hipertensión y mis niveles de glucosa están perfectos. Fue la mejor decisión de mi vida."</p>
          <p class="font-bold text-primary">Elena Montoya</p>
        </div>
      </div>
    </div>
    <div class="mt-12 text-center">
      <a href="#contacto" class="inline-block border-2 border-secondary text-secondary px-8 py-4 rounded-full font-label-sm hover:bg-secondary/5 transition-all">Quiero agendar mi cita</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Rebuild and verify in browser**

Run: `npm run build:css`
Refresh `http://localhost:8000/index.html`.
Expected: 5 bento cards under "¿Te identificas con esto?", 3 testimonial cards with placeholder images and weight-loss badges, both sections between hero and footer, no console errors.

Switch devtools to a 375px mobile viewport.
Expected: the bento cards stack in a single column (no cards clipped or overflowing), the "double-width" card doesn't force horizontal scrolling, and the 3 testimonial cards stack vertically and remain fully readable without shrinking the text illegibly.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/img/testimonial-1.svg assets/img/testimonial-2.svg assets/img/testimonial-3.svg
git commit -m "feat: add beneficios and historias sections"
```

---

### Task 4: Quiz logic module + unit tests

**Files:**
- Create: `assets/js/quiz.js`
- Create: `assets/js/quiz.test.js`

**Interfaces:**
- Produces: `getTotalSteps()`, `getQuestion(stepIndex)`, `isLastStep(stepIndex)`, `getProgressPercent(stepIndex)`, `recordAnswer(answers, stepIndex, optionIndex)`, exported both as CommonJS module and as `window.Quiz` — Task 5 consumes these to render the interactive test.

- [ ] **Step 1: Write the failing tests in `assets/js/quiz.test.js`**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const Quiz = require('./quiz.js');

test('getTotalSteps returns 4', () => {
  assert.equal(Quiz.getTotalSteps(), 4);
});

test('getQuestion returns the first question about age', () => {
  const q = Quiz.getQuestion(0);
  assert.equal(q.id, 'edad');
  assert.equal(q.options.length, 4);
});

test('getQuestion throws for an out-of-range step', () => {
  assert.throws(() => Quiz.getQuestion(4), RangeError);
});

test('isLastStep is true only on step 3', () => {
  assert.equal(Quiz.isLastStep(0), false);
  assert.equal(Quiz.isLastStep(3), true);
});

test('getProgressPercent scales from 25 to 100', () => {
  assert.equal(Quiz.getProgressPercent(0), 25);
  assert.equal(Quiz.getProgressPercent(3), 100);
});

test('recordAnswer stores the selected option text keyed by question id', () => {
  const answers = Quiz.recordAnswer({}, 0, 1);
  assert.deepEqual(answers, { edad: '31 - 45 años' });
});

test('recordAnswer throws for an out-of-range option', () => {
  assert.throws(() => Quiz.recordAnswer({}, 0, 9), RangeError);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test assets/js/quiz.test.js`
Expected: FAIL — `Cannot find module './quiz.js'`.

- [ ] **Step 3: Write `assets/js/quiz.js`**

```js
const QUESTIONS = [
  {
    id: "edad",
    title: "¿Cuál es tu rango de edad?",
    options: ["18 - 30 años", "31 - 45 años", "46 - 60 años", "Más de 60 años"]
  },
  {
    id: "peso",
    title: "¿Cómo describirías tu situación de peso actual?",
    options: [
      "Tengo entre 10-20 kg de sobrepeso",
      "Tengo más de 20 kg de sobrepeso",
      "Tengo obesidad diagnosticada por un médico",
      "No estoy seguro/a, quiero que me orienten"
    ]
  },
  {
    id: "intentos",
    title: "¿Qué has intentado hasta ahora para bajar de peso?",
    options: [
      "Dietas y ejercicio, sin resultados duraderos",
      "Medicamentos para bajar de peso",
      "Aún no he probado un tratamiento serio",
      "Ya tuve una cirugía bariátrica (busco revisión)"
    ]
  },
  {
    id: "salud",
    title: "¿Tienes alguna de estas condiciones de salud?",
    options: [
      "Diabetes tipo 2 o prediabetes",
      "Hipertensión arterial",
      "Apnea del sueño o dolores articulares",
      "Ninguna, pero quiero prevenir"
    ]
  }
];

function getTotalSteps() {
  return QUESTIONS.length;
}

function getQuestion(stepIndex) {
  if (stepIndex < 0 || stepIndex >= QUESTIONS.length) {
    throw new RangeError(`stepIndex ${stepIndex} out of range`);
  }
  return QUESTIONS[stepIndex];
}

function isLastStep(stepIndex) {
  return stepIndex === QUESTIONS.length - 1;
}

function getProgressPercent(stepIndex) {
  return Math.round(((stepIndex + 1) / QUESTIONS.length) * 100);
}

function recordAnswer(answers, stepIndex, optionIndex) {
  const question = getQuestion(stepIndex);
  const option = question.options[optionIndex];
  if (option === undefined) {
    throw new RangeError(`optionIndex ${optionIndex} out of range for step ${stepIndex}`);
  }
  return { ...answers, [question.id]: option };
}

const api = { getTotalSteps, getQuestion, isLastStep, getProgressPercent, recordAnswer, QUESTIONS };

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.Quiz = api;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test assets/js/quiz.test.js`
Expected: PASS — 7 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add assets/js/quiz.js assets/js/quiz.test.js
git commit -m "feat: add quiz state machine with unit tests"
```

---

### Task 5: Quiz UI wiring + scroll effects

**Files:**
- Modify: `index.html` (insert the "Test de Candidato" section between Beneficios and Historias)
- Modify: `assets/js/script.js` (append to the file created in Task 2 — do not overwrite the mobile menu toggle already in it)

**Interfaces:**
- Consumes: `window.Quiz` from Task 4 (`getTotalSteps`, `getQuestion`, `isLastStep`, `getProgressPercent`, `recordAnswer`).
- Produces: renders quiz DOM driven entirely by `quiz.js` data (no hardcoded step-2/3/4 markup), plus reveal-on-scroll and the top progress bar shared by later tasks.

- [ ] **Step 1: Insert the Test section markup into `index.html`, between the Beneficios `</section>` and the Historias `<section id="historias">`**

```html
<section class="py-24 relative overflow-hidden bg-primary text-on-primary-container" id="test">
  <div class="max-w-4xl mx-auto px-gutter relative z-10">
    <div class="bg-surface p-8 md:p-12 rounded-2xl shadow-2xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="font-headline-lg text-primary mb-2">Test de Candidato</h2>
          <p class="text-on-surface-variant font-body-md">Descubre en menos de 1 minuto si este camino es para ti.</p>
        </div>
        <div class="text-right">
          <span class="text-secondary font-label-sm" id="step-indicator">PASO 1 DE 4</span>
          <div class="w-32 h-1 bg-surface-container-highest mt-2 rounded-full overflow-hidden">
            <div class="h-full bg-secondary transition-all duration-500" id="step-progress" style="width: 25%;"></div>
          </div>
        </div>
      </div>
      <div id="quiz-question-container"></div>
      <div class="hidden text-center space-y-6 py-12" id="step-final">
        <div class="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto text-on-primary-fixed">
          <span class="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h3 class="font-headline-lg text-primary">¡Eres un excelente candidato!</h3>
        <p class="text-on-surface-variant max-w-md mx-auto">Basado en tus respuestas, la cirugía bariátrica podría transformar tu vida. La evaluación final la realiza el Dr. Lagos en consulta.</p>
        <a class="inline-block bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-sm" href="#contacto">Comenzar ahora</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append the quiz rendering logic to `assets/js/script.js` (add this below the existing mobile menu toggle IIFE from Task 2, don't remove it)**

```js
(function () {
  const container = document.getElementById('quiz-question-container');
  const finalStep = document.getElementById('step-final');
  const indicator = document.getElementById('step-indicator');
  const progress = document.getElementById('step-progress');

  if (!container || !window.Quiz) return;

  let currentStep = 0;
  let answers = {};

  function renderStep(stepIndex) {
    const question = window.Quiz.getQuestion(stepIndex);
    const optionsHtml = question.options
      .map(
        (option, i) => `
        <button class="w-full text-left p-4 rounded-lg border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all group flex justify-between items-center" data-option-index="${i}">
          <span class="text-on-surface group-hover:text-primary">${option}</span>
          <span class="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100">arrow_forward</span>
        </button>`
      )
      .join('');

    container.innerHTML = `
      <div class="space-y-6">
        <h3 class="font-headline-md text-primary">${question.title}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${optionsHtml}</div>
      </div>`;

    container.querySelectorAll('[data-option-index]').forEach((btn) => {
      btn.addEventListener('click', () => selectOption(stepIndex, Number(btn.dataset.optionIndex)));
    });

    indicator.textContent = `PASO ${stepIndex + 1} DE ${window.Quiz.getTotalSteps()}`;
    progress.style.width = `${window.Quiz.getProgressPercent(stepIndex)}%`;
  }

  function selectOption(stepIndex, optionIndex) {
    answers = window.Quiz.recordAnswer(answers, stepIndex, optionIndex);

    if (window.Quiz.isLastStep(stepIndex)) {
      container.classList.add('hidden');
      finalStep.classList.remove('hidden');
      indicator.textContent = 'COMPLETADO';
      progress.style.width = '100%';
      document.dispatchEvent(new CustomEvent('quiz:completed', { detail: answers }));
      return;
    }

    currentStep = stepIndex + 1;
    renderStep(currentStep);
  }

  renderStep(currentStep);
})();

// Reveal on scroll
(function () {
  const observerOptions = { threshold: 0.1 };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, observerOptions);
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
})();

// Scroll progress bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${scrolled}%`;
});
```

- [ ] **Step 3: Add the `quiz.js` script tag to `index.html`, right before the existing `assets/js/script.js` tag (script load order matters — `quiz.js` must run first)**

```html
<script src="assets/js/quiz.js"></script>
<script src="assets/js/script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Rebuild and verify in browser, desktop and mobile**

Run: `npm run build:css`
Refresh `http://localhost:8000/index.html`, scroll to the "Test de Candidato" section.
Expected: clicking any option on step 1 advances to step 2 ("¿Cómo describirías tu situación de peso actual?"), progress bar moves to 50%, and so on through all 4 steps; clicking an option on step 4 hides the question container and shows the "¡Eres un excelente candidato!" success panel with "COMPLETADO". No console errors.

Switch devtools to a 375px mobile viewport and repeat the flow.
Expected: the two answer buttons per step stack in a single column (not squeezed side-by-side), each button is comfortably tappable (full-width, adequate padding), and the step indicator/progress bar remain visible without overflowing the card.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/script.js
git commit -m "feat: wire interactive 4-step candidate quiz"
```

---

### Task 6: Form & WhatsApp utility module + unit tests

**Files:**
- Create: `assets/js/formUtils.js`
- Create: `assets/js/formUtils.test.js`

**Interfaces:**
- Produces: `validateContactForm(data)`, `buildWhatsAppUrl(phoneNumber, message)`, `buildLeadMessage({nombre, ciudad})`, exported both as CommonJS module and as `window.FormUtils` — Task 9 consumes these to wire the real form and WhatsApp links.

- [ ] **Step 1: Write the failing tests in `assets/js/formUtils.test.js`**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateContactForm, buildWhatsAppUrl, buildLeadMessage } = require('./formUtils.js');

test('validateContactForm returns no errors for valid data', () => {
  const errors = validateContactForm({ nombre: 'Ana García', whatsapp: '+57 300 000 0000', ciudad: 'Cali' });
  assert.deepEqual(errors, {});
});

test('validateContactForm flags a short name', () => {
  const errors = validateContactForm({ nombre: 'Al', whatsapp: '+573000000000', ciudad: 'Cali' });
  assert.equal(errors.nombre, 'Ingresa tu nombre completo.');
});

test('validateContactForm flags an invalid whatsapp number', () => {
  const errors = validateContactForm({ nombre: 'Ana García', whatsapp: 'abc', ciudad: 'Cali' });
  assert.equal(errors.whatsapp, 'Ingresa un número de WhatsApp válido.');
});

test('validateContactForm flags a missing ciudad', () => {
  const errors = validateContactForm({ nombre: 'Ana García', whatsapp: '+573000000000', ciudad: '' });
  assert.equal(errors.ciudad, 'Ingresa tu ciudad de residencia.');
});

test('buildWhatsAppUrl strips non-digits and URL-encodes the message', () => {
  const url = buildWhatsAppUrl('+57 310 330 0851', 'Hola & bienvenido');
  assert.equal(url, 'https://wa.me/573103300851?text=Hola%20%26%20bienvenido');
});

test('buildLeadMessage interpolates name and city', () => {
  const msg = buildLeadMessage({ nombre: 'Ana', ciudad: 'Cali' });
  assert.equal(msg, 'Hola, soy Ana, vivo en Cali, quiero agendar mi valoración.');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test assets/js/formUtils.test.js`
Expected: FAIL — `Cannot find module './formUtils.js'`.

- [ ] **Step 3: Write `assets/js/formUtils.js`**

```js
function validateContactForm(data) {
  const errors = {};
  const nombre = (data.nombre || "").trim();
  const whatsapp = (data.whatsapp || "").trim();
  const ciudad = (data.ciudad || "").trim();

  if (nombre.length < 3) {
    errors.nombre = "Ingresa tu nombre completo.";
  }
  if (!/^\+?[0-9\s]{7,15}$/.test(whatsapp)) {
    errors.whatsapp = "Ingresa un número de WhatsApp válido.";
  }
  if (ciudad.length < 2) {
    errors.ciudad = "Ingresa tu ciudad de residencia.";
  }
  return errors;
}

function buildWhatsAppUrl(phoneNumber, message) {
  const digitsOnly = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

function buildLeadMessage({ nombre, ciudad }) {
  return `Hola, soy ${nombre}, vivo en ${ciudad}, quiero agendar mi valoración.`;
}

const api = { validateContactForm, buildWhatsAppUrl, buildLeadMessage };

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.FormUtils = api;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test assets/js/formUtils.test.js`
Expected: PASS — 6 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add assets/js/formUtils.js assets/js/formUtils.test.js
git commit -m "feat: add form validation and WhatsApp URL utilities with unit tests"
```

---

### Task 7: PHP form validation + test script

**Files:**
- Create: `form/validate.php`
- Create: `form/tests/validate_test.php`

**Interfaces:**
- Produces: `validateFormData(array $data): array` — Task 8 requires this file and calls the function before sending mail.

- [ ] **Step 1: Write the failing test in `form/tests/validate_test.php`**

```php
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `php form/tests/validate_test.php`
Expected: fatal error — `require(...): Failed opening required '.../form/validate.php'`.

- [ ] **Step 3: Write `form/validate.php`**

```php
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
```

- [ ] **Step 4: Run it to verify it passes**

Run: `php form/tests/validate_test.php`
Expected: 4 lines starting with `PASS:` followed by `All validate.php tests passed.`, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add form/validate.php form/tests/validate_test.php
git commit -m "feat: add PHP form validation with test script"
```

---

### Task 8: PHP form handler with PHPMailer

**Files:**
- Create: `composer.json`
- Create: `form/config.example.php`
- Create: `form/enviar.php`

**Interfaces:**
- Consumes: `validateFormData()` from Task 7 (`form/validate.php`).
- Produces: `POST /form/enviar.php` JSON endpoint (`{ok: true}` or `{ok: false, errors: {...}}`) — Task 9's front-end `fetch()` call targets this URL.

- [ ] **Step 1: Create `composer.json`**

```json
{
  "require": {
    "phpmailer/phpmailer": "^6.9"
  }
}
```

- [ ] **Step 2: Install PHPMailer**

Run: `composer install`
Expected: `vendor/` created with `vendor/autoload.php` and `vendor/phpmailer/phpmailer/`.

- [ ] **Step 3: Create `form/config.example.php` (committed template — real credentials go in the gitignored `form/config.php`)**

```php
<?php

// Copy this file to config.php in the same directory and fill in the real
// Hostinger mailbox credentials. config.php is gitignored — never commit
// real credentials to version control.

define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_USERNAME', 'contacto@drhectorlagos.com');
define('SMTP_PASSWORD', 'REEMPLAZAR_CON_LA_CONTRASENA_REAL');
define('SMTP_PORT', 465);
define('LEAD_RECIPIENT', 'contacto@drhectorlagos.com');
```

- [ ] **Step 4: Create a local `form/config.php` for testing (not committed)**

Run:
```bash
cp form/config.example.php form/config.php
```
Then edit `form/config.php` and replace `SMTP_PASSWORD` with a real Hostinger mailbox password once available. Leave the placeholder for now — this is only needed for the live-email manual check in Task 9.

- [ ] **Step 5: Write `form/enviar.php`**

```php
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
```

- [ ] **Step 6: Verify the validation branch works end-to-end (no real email needed for this check)**

Run: `php -S localhost:8000` (from project root, separate terminal)
Run:
```bash
curl -s -X POST http://localhost:8000/form/enviar.php -H "Content-Type: application/json" -d '{"nombre":"Al","whatsapp":"abc","ciudad":""}'
```
Expected: JSON response with `"ok":false` and all three `errors` keys (`nombre`, `whatsapp`, `ciudad`) populated. This confirms `validateFormData()` is wired correctly without needing real SMTP credentials.

- [ ] **Step 7: Commit**

```bash
git add composer.json composer.lock form/config.example.php form/enviar.php
git commit -m "feat: add PHPMailer-based form handler"
```

---

### Task 9: Front-end form + WhatsApp wiring end-to-end

**Files:**
- Modify: `index.html` (insert the Contacto section, add the floating WhatsApp button, add `assets/js/formUtils.js` script tag)
- Modify: `assets/js/script.js` (add form submit handler, WhatsApp link wiring, floating button)

**Interfaces:**
- Consumes: `window.FormUtils` from Task 6, `POST /form/enviar.php` from Task 8.

- [ ] **Step 1: Insert the Contacto section into `index.html`, right after the Historias `</section>` and before `<footer>`**

```html
<section class="py-24 bg-surface relative" id="contacto">
  <div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-12">
    <div class="lg:col-span-5 space-y-6">
      <h2 class="font-headline-lg text-primary">Hoy puede ser el día en que cambie tu historia</h2>
      <p class="text-body-lg text-on-surface-variant">
        No dejes pasar más tiempo. Completa tus datos y un miembro de nuestro equipo clínico se pondrá en contacto contigo para una valoración preliminar sin compromiso.
      </p>
      <div class="space-y-4 pt-4">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined">location_on</span>
          </div>
          <span class="text-on-surface-variant">Calle 5D #38a-35, Edificio Vida, torre dos, consultorio 1013, Cali</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined">mail</span>
          </div>
          <span class="text-on-surface-variant">contacto@drhectorlagos.com</span>
        </div>
      </div>
    </div>
    <div class="lg:col-span-7">
      <form id="contact-form" class="bg-surface-container-high p-8 md:p-10 rounded-2xl shadow-lg space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block font-label-sm text-primary" for="nombre">Nombre completo</label>
            <input id="nombre" name="nombre" class="w-full bg-surface border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-3 outline-none transition-all" placeholder="Ej. Ana García" type="text">
            <p class="text-error text-sm hidden" data-error-for="nombre"></p>
          </div>
          <div class="space-y-2">
            <label class="block font-label-sm text-primary" for="whatsapp">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" class="w-full bg-surface border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-3 outline-none transition-all" placeholder="+57 300 000 0000" type="tel">
            <p class="text-error text-sm hidden" data-error-for="whatsapp"></p>
          </div>
        </div>
        <div class="space-y-2">
          <label class="block font-label-sm text-primary" for="ciudad">Ciudad de residencia</label>
          <input id="ciudad" name="ciudad" class="w-full bg-surface border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-3 outline-none transition-all" placeholder="Ej. Medellín" type="text">
          <p class="text-error text-sm hidden" data-error-for="ciudad"></p>
        </div>
        <button class="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-label-sm text-lg hover:opacity-90 transition-all shadow-md active:scale-[0.98]" type="submit">
          Quiero comenzar mi transformación
        </button>
        <p class="text-center text-sm hidden" id="form-status"></p>
        <div class="text-center pt-4 border-t border-outline-variant">
          <p class="text-on-surface-variant text-sm mb-4">O si prefieres, escríbenos directamente:</p>
          <a class="whatsapp-link flex items-center justify-center gap-2 text-primary font-bold hover:text-secondary transition-colors" href="#" data-wa-message="Hola, quiero comenzar mi transformación.">
            Contactar por WhatsApp
          </a>
        </div>
      </form>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the floating WhatsApp button, right before the closing `</body>` (after the `<script>` tags added in Task 5 so `FormUtils` loads first — actually place the button markup here, scripts stay last)**

```html
<a href="#" id="whatsapp-float" class="whatsapp-link fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform" data-wa-message="Hola, quiero agendar una consulta." aria-label="Contactar por WhatsApp" target="_blank" rel="noopener">
  <span class="material-symbols-outlined text-3xl">chat</span>
</a>
```

- [ ] **Step 3: Add `assets/js/formUtils.js` as a script tag before `script.js` in `index.html`**

```html
<script src="assets/js/quiz.js"></script>
<script src="assets/js/formUtils.js"></script>
<script src="assets/js/script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Append WhatsApp link wiring and form submit handling to `assets/js/script.js`**

```js
// WhatsApp link wiring (floating button + all inline "Contactar por WhatsApp" links)
(function () {
  const WHATSAPP_NUMBER = '+573103300851';
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const message = link.dataset.waMessage || 'Hola, quiero más información.';
    link.href = window.FormUtils.buildWhatsAppUrl(WHATSAPP_NUMBER, message);
    link.target = '_blank';
    link.rel = 'noopener';
  });
})();

// Contact form submission
(function () {
  const WHATSAPP_NUMBER = '+573103300851';
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  function showFieldErrors(errors) {
    ['nombre', 'whatsapp', 'ciudad'].forEach((field) => {
      const el = form.querySelector(`[data-error-for="${field}"]`);
      if (!el) return;
      if (errors[field]) {
        el.textContent = errors[field];
        el.classList.remove('hidden');
      } else {
        el.textContent = '';
        el.classList.add('hidden');
      }
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
      nombre: form.nombre.value,
      whatsapp: form.whatsapp.value,
      ciudad: form.ciudad.value,
    };

    const clientErrors = window.FormUtils.validateContactForm(data);
    showFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    statusEl.classList.remove('hidden');
    statusEl.textContent = 'Enviando...';

    try {
      const response = await fetch('form/enviar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.ok) {
        statusEl.textContent = '¡Gracias! Te contactaremos pronto. Abriendo WhatsApp...';
        showFieldErrors({});
        const waUrl = window.FormUtils.buildWhatsAppUrl(WHATSAPP_NUMBER, window.FormUtils.buildLeadMessage(data));
        window.open(waUrl, '_blank', 'noopener');
        form.reset();
      } else {
        showFieldErrors(result.errors || {});
        statusEl.textContent = (result.errors && result.errors.general) || 'Revisa los datos e intenta de nuevo.';
      }
    } catch (err) {
      statusEl.textContent = 'No se pudo enviar. Intenta por WhatsApp.';
    }
  });
})();
```

- [ ] **Step 5: Rebuild and verify in browser, desktop and mobile**

Run: `npm run build:css`
Run: `php -S localhost:8000` (project root)
Open `http://localhost:8000/index.html`.
Expected:
- Floating WhatsApp button visible bottom-right on every scroll position, clicking it opens `https://wa.me/573103300851?text=...` in a new tab.
- Submitting the contact form with an empty name shows the inline error "Ingresa tu nombre completo." without a page reload.
- Submitting with valid data shows "Enviando..." then either a success message + a new WhatsApp tab opening (if `form/config.php` has valid SMTP credentials) or the "No se pudo enviar" message (expected if using the placeholder password from Task 8 — this confirms the fetch/JSON wiring works even before real credentials exist).

Switch devtools to a 375px mobile viewport.
Expected: the floating WhatsApp button stays fully on-screen (not clipped by the viewport edge, not overlapping the form's submit button when scrolled to the Contacto section), the two contact-form inputs (Nombre/WhatsApp) stack in a single column instead of side-by-side, and all inputs/buttons remain comfortably tappable with no horizontal page scroll.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/script.js
git commit -m "feat: wire contact form and WhatsApp links end-to-end"
```

---

### Task 10: Tracking + deployment readiness

**Files:**
- Modify: `index.html` (add Meta Pixel + GA4 snippets, fire conversion events)
- Modify: `assets/js/script.js` (fire `fbq`/`gtag` events on lead, WhatsApp click, quiz completion)
- Create: `README.md` (Hostinger deployment steps)

**Interfaces:**
- Consumes: `quiz:completed` custom event from Task 5, form success branch from Task 9, `.whatsapp-link` click wiring from Task 9.

- [ ] **Step 1: Add the Meta Pixel and GA4 snippets to `index.html`'s `<head>`, right before `</head>`**

```html
<!-- Meta Pixel — replace PIXEL_ID_PLACEHOLDER with the real Pixel ID -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID_PLACEHOLDER');
fbq('track', 'PageView');
</script>

<!-- Google Analytics 4 — replace G-XXXXXXXXXX with the real Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
</script>
```

- [ ] **Step 2: Fire tracking events from `assets/js/script.js`**

Append to the end of the file:

```js
// Tracking events
document.addEventListener('quiz:completed', () => {
  if (window.fbq) fbq('trackCustom', 'TestCompletado');
  if (window.gtag) gtag('event', 'test_completado');
});

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.fbq) fbq('track', 'Contact');
    if (window.gtag) gtag('event', 'whatsapp_click');
  });
});
```

And inside the form submit handler in Task 9's success branch (`if (result.ok) { ... }`), add right after `statusEl.textContent = '¡Gracias!...'`:

```js
if (window.fbq) fbq('track', 'Lead');
if (window.gtag) gtag('event', 'generate_lead');
```

- [ ] **Step 3: Verify tracking calls fire without errors even with placeholder IDs**

Run: `npm run build:css`, refresh `http://localhost:8000/index.html`, open devtools console.
Expected: no JavaScript errors on page load (placeholder Pixel/GA IDs don't crash the snippets, they just report to non-existent properties). Clicking any WhatsApp link and completing the quiz does not throw errors.

Repeat at a 375px mobile viewport as a final full run-through: open the hamburger menu, navigate to each anchor, complete the 4-step quiz, and submit the contact form. Expected: every interaction from Tasks 2–9 still works with no layout overflow, at this final combined state of the page.

- [ ] **Step 4: Write `README.md` with local setup and Hostinger deployment steps**

```markdown
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
```

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/script.js README.md
git commit -m "feat: add Meta Pixel/GA4 tracking and deployment README"
```

---

## Self-Review Notes

- **Spec coverage:** all 8 sections from the spec (nav, hero, beneficios, test de candidato, historias, contacto, footer, floating WhatsApp) are covered across Tasks 2, 3, 5, 9. Form → email + WhatsApp flow is Task 9. Tracking is Task 10. Deployment is Task 10. Real data (address, WhatsApp, email) is wired in Tasks 2 and 9. Quiz's 4 real questions are Task 4/5. Tailwind compiled build (no CDN) is Task 1. Local image placeholders (no hotlinked Google URLs) are Tasks 2/3. Mobile-first requirement (added after the spec was written, per client follow-up): working hamburger menu is Task 2, and every subsequent task's browser-verification step (2, 3, 5, 9, 10) includes an explicit 375px mobile-viewport check.
- **Type consistency checked:** `window.Quiz` API (`getTotalSteps`, `getQuestion`, `isLastStep`, `getProgressPercent`, `recordAnswer`) defined in Task 4 matches exactly how Task 5's `script.js` calls it. `window.FormUtils` API (`validateContactForm`, `buildWhatsAppUrl`, `buildLeadMessage`) defined in Task 6 matches exactly how Task 9 calls it. `validateFormData()` signature in Task 7 (`form/validate.php`) matches how Task 8's `enviar.php` calls it.
- **No placeholders left in code steps** — the only literal placeholders are the Meta Pixel ID and GA4 Measurement ID (Task 10), which are external account IDs the client must supply and are explicitly documented as such in the README, not vague TODOs.
