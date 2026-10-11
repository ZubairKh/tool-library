const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');

const { createRecommendationsRouter } = require('../routes/recommendations');

function buildApp({ tools, provider, timeoutMs = 200 }) {
  const app = express();
  app.use(express.json());
  app.use('/api/tools', createRecommendationsRouter({
    getCatalogTools: async () => tools,
    provider,
    timeoutMs,
  }));
  return app;
}

test('rejects invalid input when task is missing', async () => {
  const app = buildApp({
    tools: [],
    provider: { mode: 'mock', recommend: async () => ({ recommendations: [], notes: [] }) },
  });

  const res = await request(app).post('/api/tools/recommend').send({});

  assert.equal(res.status, 400);
  assert.match(res.body.error, /task is required/i);
});

test('handles empty catalogue without fabricating tools', async () => {
  const app = buildApp({
    tools: [],
    provider: { mode: 'mock', recommend: async ({ tools: t }) => ({ mode: 'mock', recommendations: [], notes: t.length === 0 ? ['Catalogue is empty, so no recommendations can be made.'] : [] }) },
  });

  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to assemble furniture' });

  assert.equal(res.status, 200);
  assert.equal(res.body.recommendations.length, 0);
  assert.match(res.body.notes[0], /empty/i);
});

test('returns unavailable tool with caveat when it is relevant', async () => {
  const tools = [
    { id: 't1', name: 'Hammer Drill', category: 'Power Tools', condition: 'good', isAvailable: false },
    { id: 't2', name: 'Tape Measure', category: 'Measuring', condition: 'good', isAvailable: true },
  ];

  const provider = {
    mode: 'mock',
    recommend: async () => ({
      mode: 'mock',
      recommendations: [
        {
          toolId: 't1',
          score: 8,
          reason: 'Suitable for drilling into concrete.',
          limitations: ['This tool is currently unavailable in the catalogue.'],
        },
      ],
      notes: [],
    }),
  };

  const app = buildApp({ tools, provider });
  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to drill into a concrete wall' });

  assert.equal(res.status, 200);
  assert.equal(res.body.recommendations.length, 1);
  assert.equal(res.body.recommendations[0].toolId, 't1');
  assert.equal(res.body.recommendations[0].isAvailable, false);
  assert.match(res.body.recommendations[0].limitations.join(' '), /unavailable/i);
});

test('rejects malformed provider output', async () => {
  const tools = [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }];

  const app = buildApp({
    tools,
    provider: {
      mode: 'mock',
      recommend: async () => ({ notRecommendations: [] }),
    },
  });

  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to assemble furniture' });

  assert.equal(res.status, 502);
  assert.match(res.body.error, /malformed/i);
});

test('rejects non-array recommendations as malformed provider output', async () => {
  const tools = [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }];

  const app = buildApp({
    tools,
    provider: {
      mode: 'openai',
      recommend: async () => ({ recommendations: null, notes: [] }),
    },
  });

  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to assemble furniture' });

  assert.equal(res.status, 502);
  assert.match(res.body.error, /malformed/i);
});

test('returns timeout status when provider exceeds timeout', async () => {
  const tools = [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }];

  const app = buildApp({
    tools,
    timeoutMs: 30,
    provider: {
      mode: 'mock',
      recommend: async () => new Promise((resolve) => setTimeout(() => resolve({ recommendations: [] }), 100)),
    },
  });

  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to assemble furniture' });

  assert.equal(res.status, 504);
  assert.match(res.body.error, /timed out/i);
});

test('filters out provider tool ids not present in catalogue', async () => {
  const tools = [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }];

  const app = buildApp({
    tools,
    provider: {
      mode: 'mock',
      recommend: async () => ({
        recommendations: [
          { toolId: 'fake-id', reason: 'Not real', limitations: [], score: 10 },
          { toolId: 't1', reason: 'Real tool', limitations: [], score: 8 },
        ],
        notes: [],
      }),
    },
  });

  const res = await request(app)
    .post('/api/tools/recommend')
    .send({ task: 'I need to tighten screws' });

  assert.equal(res.status, 200);
  assert.equal(res.body.recommendations.length, 1);
  assert.equal(res.body.recommendations[0].toolId, 't1');
});

test('mock recommender returns deterministic results for same input', async () => {
  const tools = [
    { id: 't1', name: 'Hammer Drill', category: 'Power Tools', condition: 'good', isAvailable: true },
    { id: 't2', name: 'Paint Brush', category: 'Painting', condition: 'good', isAvailable: true },
    { id: 't3', name: 'Screwdriver Set', category: 'Hand Tools', condition: 'good', isAvailable: true },
  ];

  const { recommendWithMock } = require('../services/mockRecommender');

  const first = await recommendWithMock({ task: 'I need to drill into a concrete wall', tools });
  const second = await recommendWithMock({ task: 'I need to drill into a concrete wall', tools });

  assert.deepEqual(first, second);
});
