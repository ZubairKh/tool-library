const { recommendWithMock } = require('./mockRecommender');
const { createOpenAIProvider } = require('./openAIProvider');
const { createGeminiProvider } = require('./geminiProvider');

function shouldFallback(err) {
  if (!err) return false;
  if (err.code === 'PROVIDER_TIMEOUT') return true;
  if (err.code !== 'PROVIDER_HTTP_ERROR') return false;

  const status = Number(err.status || 0);
  if ([429, 503, 504].includes(status)) return true;

  const details = String(err.details || '').toLowerCase();
  return details.includes('insufficient_quota') || details.includes('credit_balance_exhausted');
}

function createFallbackProvider(primary, fallback) {
  return {
    mode: `${primary.mode}->${fallback.mode}`,
    async recommend(input) {
      try {
        return await primary.recommend(input);
      } catch (err) {
        if (!shouldFallback(err)) throw err;
        const fallbackOutput = await fallback.recommend(input);
        return {
          ...fallbackOutput,
          mode: `${fallback.mode}-fallback`,
        };
      }
    },
  };
}

function buildProvider() {
  const mockMode = String(process.env.AI_MOCK_MODE || 'true').toLowerCase() === 'true';
  const providerName = String(process.env.AI_PROVIDER || 'openai').toLowerCase();
  const fallbackName = String(process.env.AI_FALLBACK_PROVIDER || '').toLowerCase();

  if (mockMode) {
    return {
      mode: 'mock',
      recommend: recommendWithMock,
    };
  }

  if (providerName === 'openai') {
    const openaiProvider = createOpenAIProvider({
      apiKey: process.env.AI_API_KEY,
      model: process.env.AI_MODEL,
      timeoutMs: Number(process.env.AI_TIMEOUT_MS || 10000),
    });

    if (fallbackName === 'gemini') {
      const geminiProvider = createGeminiProvider({
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL,
        timeoutMs: Number(process.env.AI_TIMEOUT_MS || 10000),
      });
      return createFallbackProvider(openaiProvider, geminiProvider);
    }

    return openaiProvider;
  }

  if (providerName === 'gemini') {
    return createGeminiProvider({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL,
      timeoutMs: Number(process.env.AI_TIMEOUT_MS || 10000),
    });
  }

  return {
    mode: 'unconfigured',
    recommend: async () => {
      const err = new Error(`Unsupported AI_PROVIDER: ${providerName}. Use openai, gemini, or AI_MOCK_MODE=true.`);
      err.code = 'PROVIDER_NOT_CONFIGURED';
      throw err;
    },
  };
}

module.exports = {
  buildProvider,
};
