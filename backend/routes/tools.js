const router = require('express').Router();
const Tool = require('../models/Tools');
const verifyToken = require('../middleware/auth');

/**
 * @openapi
 * /api/tools:
 *   get:
 *     summary: List tools
 *     responses:
 *       200:
 *         description: Array of tools
 */
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const tools = await Tool.find(filter).sort({ createdAt: -1 });
  res.json(tools);
});

/**
 * @openapi
 * /api/tools:
 *   post:
 *     summary: Create a tool (requires login)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *             required: [name, category]
 *     responses:
 *       201:
 *         description: Created tool
 *       401:
 *         description: No or invalid token
 */
router.post('/', verifyToken, async (req, res) => {
  const tool = await Tool.create({ ...req.body, ownerId: req.userId });
  res.status(201).json(tool);
});

router.patch('/:id', async (req, res) => {
  const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tool);
});

router.delete('/:id', async (req, res) => {
  await Tool.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;