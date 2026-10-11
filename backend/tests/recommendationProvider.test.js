const test = require('node:test');
const assert = require('node:assert/strict');

test('buildProvider returns mock provider when AI_MOCK_MODE=true', () => {
  process.env.AI_MOCK_MODE = 'true';
  delete process.env.AI_PROVIDER;

  delete require.cache[require.resolve('../services/recommendationProvider')];
  const { buildProvider } = require('../services/recommendationProvider');

  const provider = buildProvider();
  assert.equal(provider.mode, 'mock');
  assert.equal(typeof provider.recommend, 'function');
});

test('buildProvider returns unconfigured for unsupported provider', async () => {
  process.env.AI_MOCK_MODE = 'false';
  process.env.AI_PROVIDER = 'unknown-provider';

  delete require.cache[require.resolve('../services/recommendationProvider')];
  const { buildProvider } = require('../services/recommendationProvider');

  const provider = buildProvider();
  assert.equal(provider.mode, 'unconfigured');
  await assert.rejects(provider.recommend({ task: 'x', tools: [] }), /Unsupported AI_PROVIDER/);
});
