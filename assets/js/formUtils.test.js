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
