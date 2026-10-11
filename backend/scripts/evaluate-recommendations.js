const fs = require('node:fs');
const path = require('node:path');
const { recommendWithMock } = require('../services/mockRecommender');

const fixturePath = path.join(__dirname, '..', 'evaluation', 'recommendation-cases.json');

const demoCatalog = [
  { id: 't-screwdriver', name: 'Screwdriver Set', category: 'Hand Tools', condition: 'good', isAvailable: true },
  { id: 't-cordless-drill', name: 'Cordless Drill', category: 'Power Tools', condition: 'good', isAvailable: true },
  { id: 't-hammer-drill', name: 'Hammer Drill', category: 'Power Tools', condition: 'good', isAvailable: false },
  { id: 't-jigsaw', name: 'Jigsaw', category: 'Power Tools', condition: 'good', isAvailable: true },
  { id: 't-paint-roller', name: 'Paint Roller', category: 'Painting', condition: 'new', isAvailable: true },
  { id: 't-paint-brush', name: 'Paint Brush', category: 'Painting', condition: 'good', isAvailable: true },
  { id: 't-tape-measure', name: 'Tape Measure', category: 'Measuring', condition: 'good', isAvailable: true }
];

function computeReciprocalRank(predictedIds, expectedIds) {
  for (let i = 0; i < predictedIds.length; i += 1) {
    if (expectedIds.includes(predictedIds[i])) return 1 / (i + 1);
  }
  return 0;
}

function hitAtK(predictedIds, expectedIds, k) {
  return predictedIds.slice(0, k).some((id) => expectedIds.includes(id)) ? 1 : 0;
}

async function run() {
  const cases = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  let sumHit1 = 0;
  let sumHit3 = 0;
  let sumMRR = 0;

  const rows = [];

  for (const c of cases) {
    const result = await recommendWithMock({ task: c.task, tools: demoCatalog });
    const predictedIds = result.recommendations.map((r) => r.toolId);

    const hit1 = hitAtK(predictedIds, c.expectedToolIds, 1);
    const hit3 = hitAtK(predictedIds, c.expectedToolIds, 3);
    const rr = computeReciprocalRank(predictedIds, c.expectedToolIds);

    sumHit1 += hit1;
    sumHit3 += hit3;
    sumMRR += rr;

    rows.push({
      caseId: c.id,
      expected: c.expectedToolIds,
      predictedTop3: predictedIds.slice(0, 3),
      hit1,
      hit3,
      reciprocalRank: Number(rr.toFixed(3)),
    });
  }

  const n = cases.length || 1;
  const summary = {
    mode: 'mock',
    caseCount: cases.length,
    hitAt1: Number((sumHit1 / n).toFixed(3)),
    hitAt3: Number((sumHit3 / n).toFixed(3)),
    mrr: Number((sumMRR / n).toFixed(3)),
  };

  console.log('Recommendation Evaluation Results');
  console.log('=================================');
  console.log(JSON.stringify(summary, null, 2));
  console.log('\nPer-case details:');
  console.log(JSON.stringify(rows, null, 2));
}

run().catch((err) => {
  console.error('Evaluation failed:', err);
  process.exit(1);
});
