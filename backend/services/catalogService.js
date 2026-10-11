const Tool = require('../models/Tools');

async function getCatalogTools() {
  const tools = await Tool.find({}).sort({ createdAt: -1 }).lean();
  return tools.map((tool) => ({
    id: String(tool._id),
    name: tool.name,
    category: tool.category,
    condition: tool.condition,
    isAvailable: Boolean(tool.isAvailable),
  }));
}

module.exports = {
  getCatalogTools,
};
