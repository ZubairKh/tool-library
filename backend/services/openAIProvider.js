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

function createOpenAIProvider({
  apiKey,
  model,
  timeoutMs = 10000,
  baseUrl = 'https://api.openai.com/v1',
  fetchImpl = fetch,
}) {
  if (!apiKey || typeof apiKey !== 'string') {
    const err = new Error('AI_API_KEY is missing for real provider mode.');
    err.code = 'PROVIDER_NOT_CONFIGURED';
    throw err;
  }

  const chosenModel = model || 'gpt-4o-mini';

  return {
    mode: 'openai',
    async recommend({ task, tools }) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: chosenModel,
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You output strictly valid JSON for tool recommendations.',
              },
              {
                role: 'user',
                content: buildPrompt({ task, tools }),
              },
            ],
          }),
        });

        if (!response.ok) {
          const bodyText = await response.text();
          const err = new Error(`Provider request failed with status ${response.status}`);
          err.code = 'PROVIDER_HTTP_ERROR';
          err.details = bodyText.slice(0, 500);
          throw err;
        }

        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
          const err = new Error('Provider returned empty content');
          err.code = 'MALFORMED_PROVIDER_OUTPUT';
          throw err;
        }

        const parsed = safeJsonParse(content);
        return {
          mode: 'openai',
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
  createOpenAIProvider,
  buildPrompt,
  safeJsonParse,
};
