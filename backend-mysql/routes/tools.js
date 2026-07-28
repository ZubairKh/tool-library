module.exports = (prisma) => {
  const router = require('express').Router();

  router.get('/', async (req, res) => {
    const where = req.query.category ? { category: req.query.category } : {};
    const tools = await prisma.tool.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(tools);
  });

  router.post('/', async (req, res) => {
    const tool = await prisma.tool.create({ data: req.body });
    res.status(201).json(tool);
  });

  router.patch('/:id', async (req, res) => {
    const tool = await prisma.tool.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(tool);
  });

  router.delete('/:id', async (req, res) => {
    await prisma.tool.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  });

  return router;
};