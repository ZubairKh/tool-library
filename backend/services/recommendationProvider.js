const { recommendWithMock } = require('./mockRecommender');
const { createOpenAIProvider } = require('./openAIProvider');

function buildProvider() {
  const mockMode = String(process.env.AI_MOCK_MODE || 'true').toLowerCase() === 'true';
  const providerName = String(process.env.AI_PROVIDER || 'openai').toLowerCase();

  if (mockMode) {
    return {
      mode: 'mock',
      recommend: recommendWithMock,
    };
  }

  if (providerName === 'openai') {
    return createOpenAIProvider({
      apiKey: process.env.AI_API_KEY,
      model: process.env.AI_MODEL,
      timeoutMs: Number(process.env.AI_TIMEOUT_MS || 10000),
    });
  }

  return {
    mode: 'unconfigured',
    recommend: async () => {
      const err = new Error(`Unsupported AI_PROVIDER: ${providerName}. Use AI_PROVIDER=openai or AI_MOCK_MODE=true.`);
      err.code = 'PROVIDER_NOT_CONFIGURED';
      throw err;
    },
  };
}

module.exports = {
  buildProvider,
};
