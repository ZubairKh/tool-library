const test = require('node:test');
const assert = require('node:assert/strict');

const { createGeminiProvider, safeJsonParse, buildPrompt } = require('../services/geminiProvider');

test('gemini safeJsonParse parses fenced JSON', () => {
  const parsed = safeJsonParse('```json\n{"recommendations":[],"notes":["ok"]}\n```');
  assert.deepEqual(parsed, { recommendations: [], notes: ['ok'] });
});

test('gemini buildPrompt includes task and tool summary', () => {
  const prompt = buildPrompt({
    task: 'I need to assemble furniture',
    tools: [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }],
  });

  assert.match(prompt, /assemble furniture/i);
  assert.match(prompt, /Screwdriver/);
});

test('createGeminiProvider requires api key', () => {
  assert.throws(() => createGeminiProvider({ apiKey: '' }), /GEMINI_API_KEY is missing/);
});

test('createGeminiProvider returns parsed structured output', async () => {
  const fakeFetch = async () => ({
    ok: true,
    async json() {
      return {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    recommendations: [
                      {
                        toolId: 't1',
                        reason: 'Useful for screws',
                        limitations: ['Use correct size bits'],
                        score: 8,
                      },
                    ],
                    notes: ['Parsed from Gemini'],
                  }),
                },
              ],
            },
          },
        ],
      };
    },
  });

  const provider = createGeminiProvider({
    apiKey: 'gem-key',
    fetchImpl: fakeFetch,
  });

  const output = await provider.recommend({
    task: 'I need to tighten screws',
    tools: [{ id: 't1', name: 'Screwdriver', category: 'Hand Tools', condition: 'good', isAvailable: true }],
  });

  assert.equal(output.mode, 'gemini');
  assert.equal(output.recommendations.length, 1);
  assert.equal(output.recommendations[0].toolId, 't1');
});
