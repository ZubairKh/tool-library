function validateInput(body) {
  const task = typeof body?.task === 'string' ? body.task.trim() : '';
  if (!task) {
    return { ok: false, status: 400, message: 'task is required and must be a non-empty string' };
  }
  if (task.length < 5) {
    return { ok: false, status: 400, message: 'task must be at least 5 characters long' };
  }
  if (task.length > 500) {
    return { ok: false, status: 400, message: 'task must be at most 500 characters long' };
  }
  return { ok: true, task };
}

function validateProviderOutput(output, tools) {
  if (!output || !Array.isArray(output.recommendations)) {
    const err = new Error('Provider returned malformed output');
    err.code = 'MALFORMED_PROVIDER_OUTPUT';
    throw err;
  }

  const toolById = new Map(tools.map((t) => [t.id, t]));

  const recommendations = output.recommendations
    .filter((item) => item && typeof item.toolId === 'string')
    .map((item) => {
      const tool = toolById.get(item.toolId);
      if (!tool) return null;

      return {
        toolId: tool.id,
        name: tool.name,
        category: tool.category,
        condition: tool.condition,
        isAvailable: tool.isAvailable,
        reason: typeof item.reason === 'string' && item.reason.trim().length > 0
          ? item.reason.trim()
          : 'Recommended based on task-to-tool relevance from catalogue metadata.',
        limitations: Array.isArray(item.limitations)
          ? item.limitations.filter((x) => typeof x === 'string' && x.trim().length > 0).slice(0, 3)
          : [],
        score: typeof item.score === 'number' ? item.score : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return {
    mode: output.mode || 'unknown',
    recommendations,
    notes: Array.isArray(output.notes) ? output.notes.filter((x) => typeof x === 'string') : [],
  };
}

module.exports = {
  validateInput,
  validateProviderOutput,
};
