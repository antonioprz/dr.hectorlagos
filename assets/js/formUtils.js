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
