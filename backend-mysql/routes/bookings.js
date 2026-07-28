module.exports = (prisma) => {
  const router = require('express').Router();

  // GET history, with the related tool pulled in via a join
  router.get('/', async (req, res) => {
    const bookings = await prisma.booking.findMany({
      include: { tool: true },
      orderBy: { borrowedAt: 'desc' },
    });
    res.json(bookings);
  });

  // Borrow — same transactional logic as the Mongo version,
  // but here it's an actual DB transaction, not two separate saves
  router.post('/', async (req, res) => {
    const { toolId, borrowerName } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const tool = await tx.tool.findUnique({ where: { id: toolId } });
      if (!tool || !tool.isAvailable) {
        throw new Error('Tool not available');
      }
      const booking = await tx.booking.create({ data: { toolId, borrowerName } });
      await tx.tool.update({ where: { id: toolId }, data: { isAvailable: false } });
      return booking;
    });

    res.status(201).json(result);
  });

  router.patch('/:id/return', async (req, res) => {
    const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { returnedAt: new Date() },
      }),
      prisma.tool.update({
        where: { id: booking.toolId },
        data: { isAvailable: true },
      }),
    ]);
    res.json({ status: 'returned' });
  });

  return router;
};