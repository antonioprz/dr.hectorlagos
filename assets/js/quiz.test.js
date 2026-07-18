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
