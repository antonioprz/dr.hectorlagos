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

// Test de Candidato — 4-step quiz rendering
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

// Hide the floating WhatsApp button while the contact section (which has its
// own WhatsApp link) is in view, so it never sits on top of the form fields.
(function () {
  const floatBtn = document.getElementById('whatsapp-float');
  const contactSection = document.getElementById('contacto');
  if (!floatBtn || !contactSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        floatBtn.classList.toggle('opacity-0', entry.isIntersecting);
        floatBtn.classList.toggle('pointer-events-none', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );
  observer.observe(contactSection);
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
      website: form.website.value,
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
        if (window.fbq) fbq('track', 'Lead');
        if (window.gtag) gtag('event', 'generate_lead');
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
