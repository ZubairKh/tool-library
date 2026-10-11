const express = require('express');
const { getCatalogTools: getCatalogToolsDefault } = require('../services/catalogService');
const { buildProvider } = require('../services/recommendationProvider');
const { validateInput, validateProviderOutput } = require('../services/recommendationValidation');

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error('Recommendation provider timed out');
      err.code = 'PROVIDER_TIMEOUT';
      reject(err);
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function createRecommendationsRouter(deps = {}) {
  const router = express.Router();
  const getCatalogTools = deps.getCatalogTools || getCatalogToolsDefault;
  const provider = deps.provider || buildProvider();
  const timeoutMs = Number(deps.timeoutMs || process.env.AI_TIMEOUT_MS || 10000);

  /**
   * @openapi
   * /api/tools/recommend:
   *   post:
   *     summary: Recommend tools for a natural-language task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               task: { type: string }
   *             required: [task]
   *     responses:
   *       200:
   *         description: Structured recommendations based on existing catalogue tools
   *       400:
   *         description: Invalid input
   *       502:
   *         description: Invalid provider output
   *       504:
   *         description: Provider timeout
   */
  router.post('/recommend', async (req, res) => {
    const inputCheck = validateInput(req.body);
    if (!inputCheck.ok) {
      return res.status(inputCheck.status).json({ error: inputCheck.message });
    }

    try {
      const tools = await getCatalogTools();
      const rawOutput = await withTimeout(
        provider.recommend({ task: inputCheck.task, tools }),
        timeoutMs,
      );

      const normalized = validateProviderOutput(rawOutput, tools);

      return res.json({
        task: inputCheck.task,
        providerMode: provider.mode,
        recommendations: normalized.recommendations,
        notes: normalized.notes,
      });
    } catch (err) {
      if (err.code === 'PROVIDER_TIMEOUT') {
        return res.status(504).json({ error: 'AI recommendation request timed out. Please try again.' });
      }
      if (err.code === 'MALFORMED_PROVIDER_OUTPUT') {
        return res.status(502).json({ error: 'AI provider returned malformed recommendation data.' });
      }
      if (err.code === 'PROVIDER_NOT_CONFIGURED') {
        return res.status(503).json({ error: err.message });
      }

      return res.status(500).json({ error: 'Failed to generate recommendations.' });
    }
  });

  return router;
}

module.exports = {
  createRecommendationsRouter,
};
