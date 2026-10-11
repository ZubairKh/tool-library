const { recommendWithMock } = require('./mockRecommender');

function buildProvider() {
  const mockMode = String(process.env.AI_MOCK_MODE || 'true').toLowerCase() === 'true';

  if (mockMode) {
    return {
      mode: 'mock',
      recommend: recommendWithMock,
    };
  }

  return {
    mode: 'unconfigured',
    recommend: async () => {
      const err = new Error('Real AI provider is not configured yet. Enable AI_MOCK_MODE=true for demo mode.');
      err.code = 'PROVIDER_NOT_CONFIGURED';
      throw err;
    },
  };
}

module.exports = {
  buildProvider,
};
