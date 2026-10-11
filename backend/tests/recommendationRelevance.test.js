const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { recommendWithMock } = require('../services/mockRecommender');

const cases = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'evaluation', 'recommendation-cases.json'), 'utf8'),
);

const demoCatalog = [
  { id: 't-screwdriver', name: 'Screwdriver Set', category: 'Hand Tools', condition: 'good', isAvailable: true },
  { id: 't-cordless-drill', name: 'Cordless Drill', category: 'Power Tools', condition: 'good', isAvailable: true },
  { id: 't-hammer-drill', name: 'Hammer Drill', category: 'Power Tools', condition: 'good', isAvailable: false },
  { id: 't-jigsaw', name: 'Jigsaw', category: 'Power Tools', condition: 'good', isAvailable: true },
  { id: 't-paint-roller', name: 'Paint Roller', category: 'Painting', condition: 'new', isAvailable: true },
  { id: 't-paint-brush', name: 'Paint Brush', category: 'Painting', condition: 'good', isAvailable: true },
  { id: 't-tape-measure', name: 'Tape Measure', category: 'Measuring', condition: 'good', isAvailable: true },
];

test('mock recommendations include at least one expected tool in top 3 for predefined tasks', async () => {
  for (const c of cases) {
    const result = await recommendWithMock({ task: c.task, tools: demoCatalog });
    const predictedTop3 = result.recommendations.map((r) => r.toolId).slice(0, 3);
    const hasExpected = predictedTop3.some((id) => c.expectedToolIds.includes(id));

    assert.equal(
      hasExpected,
      true,
      `Expected one of ${c.expectedToolIds.join(', ')} in top3 for case ${c.id}, got ${predictedTop3.join(', ')}`,
    );
  }
});
