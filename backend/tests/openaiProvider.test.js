const test = require('node:test');
const assert = require('node:assert/strict');

const { createOpenAIProvider, safeJsonParse, buildPrompt } = require('../services/openAIProvider');

test('safeJsonParse parses fenced JSON', () => {
  const parsed = safeJsonParse('```json\n{"recommendations":[],"notes":["ok"]}\n```');
  assert.deepEqual(parsed, { recommendations: [], notes: ['ok'] });
});

test('safeJsonParse throws malformed output for invalid json', () => {
  assert.throws(() => safeJsonParse('not json'), /non-JSON/);
});

test('buildPrompt includes task and catalogue summary only', () => {
  const prompt = buildPrompt({
    task: 'I need to assemble furniture',
    tools: [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }],
  });

  assert.match(prompt, /assemble furniture/i);
  assert.match(prompt, /Screwdriver/);
  assert.doesNotMatch(prompt, /email|password|token/i);
});

test('createOpenAIProvider requires api key in real mode', () => {
  assert.throws(() => createOpenAIProvider({ apiKey: '' }), /AI_API_KEY is missing/);
});

test('createOpenAIProvider returns parsed structured output', async () => {
  const fakeFetch = async () => ({
    ok: true,
    async json() {
      return {
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendations: [
                  {
                    toolId: 't1',
                    reason: 'Useful for screws',
                    limitations: ['Not ideal for concrete'],
                    score: 7,
                  },
                ],
                notes: ['Based on catalogue metadata'],
              }),
            },
          },
        ],
      };
    },
  });

  const provider = createOpenAIProvider({
    apiKey: 'test-key',
    model: 'gpt-4o-mini',
    fetchImpl: fakeFetch,
  });

  const output = await provider.recommend({
    task: 'I need to tighten screws',
    tools: [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }],
  });

  assert.equal(output.mode, 'openai');
  assert.equal(output.recommendations.length, 1);
  assert.equal(output.recommendations[0].toolId, 't1');
});

test('createOpenAIProvider maps abort to provider timeout', async () => {
  const abortingFetch = async (_url, options) => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    if (options?.signal) {
      throw err;
    }
    throw err;
  };

  const provider = createOpenAIProvider({
    apiKey: 'test-key',
    timeoutMs: 1,
    fetchImpl: abortingFetch,
  });

  await assert.rejects(
    provider.recommend({ task: 'test task', tools: [] }),
    (err) => err && err.code === 'PROVIDER_TIMEOUT',
  );
});
