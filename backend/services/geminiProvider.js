function stripFence(text) {
  const trimmed = String(text || '').trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(stripFence(raw));
  } catch (err) {
    const parseError = new Error('Provider returned non-JSON content');
    parseError.code = 'MALFORMED_PROVIDER_OUTPUT';
    throw parseError;
  }
}

function buildPrompt({ task, tools }) {
  const toolSummary = tools.map((tool) => ({
    toolId: tool.id,
    name: tool.name,
    category: tool.category,
    condition: tool.condition,
    isAvailable: tool.isAvailable,
  }));

  return [
    'You are an assistant for a university Tool Library project.',
    'Use ONLY the provided catalogue tools.',
    'Do not invent tools, IDs, availability, or stock.',
    'Return JSON only with shape:',
    '{"recommendations":[{"toolId":"string","reason":"string","limitations":["string"],"score":number}],"notes":["string"]}',
    'If uncertain, return fewer recommendations and explain uncertainty in notes.',
    'Include caveats when tool is unavailable or task has safety risks.',
    '',
    `Task: ${task}`,
    `Catalogue: ${JSON.stringify(toolSummary)}`,
  ].join('\n');
}

function createGeminiProvider({
  apiKey,
  model,
  timeoutMs = 10000,
  baseUrl = 'https://generativelanguage.googleapis.com/v1beta',
  fetchImpl = fetch,
}) {
  if (!apiKey || typeof apiKey !== 'string') {
    const err = new Error('GEMINI_API_KEY is missing for Gemini provider mode.');
    err.code = 'PROVIDER_NOT_CONFIGURED';
    throw err;
  }

  const chosenModel = model || 'gemini-flash-lite-latest';

  return {
    mode: 'gemini',
    async recommend({ task, tools }) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(`${baseUrl}/models/${chosenModel}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            generationConfig: {
              temperature: 0,
              responseMimeType: 'application/json',
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: buildPrompt({ task, tools }) }],
              },
            ],
          }),
        });

        if (!response.ok) {
          const bodyText = await response.text();
          const err = new Error(`Provider request failed with status ${response.status}`);
          err.code = 'PROVIDER_HTTP_ERROR';
          err.status = response.status;
          err.details = bodyText.slice(0, 600);
          throw err;
        }

        const payload = await response.json();
        const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (typeof content !== 'string' || !content.trim()) {
          const err = new Error('Provider returned empty content');
          err.code = 'MALFORMED_PROVIDER_OUTPUT';
          throw err;
        }

        const parsed = safeJsonParse(content);
        return {
          mode: 'gemini',
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : null,
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        };
      } catch (err) {
        if (err && err.name === 'AbortError') {
          const timeoutError = new Error('Provider request timeout');
          timeoutError.code = 'PROVIDER_TIMEOUT';
          throw timeoutError;
        }
        throw err;
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

module.exports = {
  createGeminiProvider,
  buildPrompt,
  safeJsonParse,
};
