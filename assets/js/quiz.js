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
