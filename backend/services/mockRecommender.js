function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function keywordMap() {
  return [
    {
      keywords: ['drill', 'concrete', 'wall', 'hole', 'masonry'],
      toolHints: ['drill', 'hammer drill', 'masonry'],
      caveat: 'Use correct drill bits and PPE when drilling into masonry or concrete.',
    },
    {
      keywords: ['assemble', 'furniture', 'screw', 'screws', 'flatpack'],
      toolHints: ['screwdriver', 'drill', 'hex', 'allen', 'wrench'],
      caveat: 'Avoid overtightening to prevent damage to furniture joints.',
    },
    {
      keywords: ['cut', 'wood', 'trim', 'saw'],
      toolHints: ['saw', 'jigsaw', 'circular'],
      caveat: 'Secure materials and keep hands clear of cutting path.',
    },
    {
      keywords: ['paint', 'wall', 'roller', 'brush'],
      toolHints: ['roller', 'brush', 'tray'],
      caveat: 'Use ventilation and surface preparation for better finish quality.',
    },
  ];
}

function scoreTool(taskTokens, tool, rules) {
  const haystack = normalize([tool.name, tool.category, tool.condition].join(' '));
  const haystackSet = new Set(haystack);

  let score = 0;
  const reasons = [];
  const caveats = [];

  for (const token of taskTokens) {
    if (haystackSet.has(token)) {
      score += 2;
    }
  }

  for (const rule of rules) {
    const taskMatchesRule = rule.keywords.some((k) => taskTokens.includes(k));
    if (!taskMatchesRule) continue;

    const toolFitsRule = rule.toolHints.some((hint) => haystackSet.has(hint));
    if (toolFitsRule) {
      score += 3;
      reasons.push(`Matches common tooling patterns for tasks involving ${rule.keywords.slice(0, 2).join(' and ')}.`);
      caveats.push(rule.caveat);
    }
  }

  if (!tool.isAvailable) {
    score -= 1;
    caveats.push('This tool is currently unavailable in the catalogue.');
  }

  if (score <= 0) return null;

  return {
    toolId: tool.id,
    score,
    reason: reasons[0] || `The tool name/category aligns with keywords in the task description.`,
    limitations: Array.from(new Set(caveats)),
  };
}

async function recommendWithMock({ task, tools }) {
  const taskTokens = normalize(task);

  if (!Array.isArray(tools) || tools.length === 0) {
    return {
      mode: 'mock',
      recommendations: [],
      notes: ['Catalogue is empty, so no recommendations can be made.'],
    };
  }

  const rules = keywordMap();

  const ranked = tools
    .map((tool) => scoreTool(taskTokens, tool, rules))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.toolId.localeCompare(b.toolId))
    .slice(0, 5);

  if (ranked.length === 0) {
    return {
      mode: 'mock',
      recommendations: [],
      notes: ['No sufficiently relevant tools were found for this task in the current catalogue.'],
    };
  }

  return {
    mode: 'mock',
    recommendations: ranked,
    notes: [],
  };
}

module.exports = {
  recommendWithMock,
};
