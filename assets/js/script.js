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
