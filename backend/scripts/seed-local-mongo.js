require('dotenv').config();
const mongoose = require('mongoose');
const Tool = require('../models/Tools');

const demoTools = [
  { name: 'Hammer Drill', category: 'Power Tools', condition: 'good', isAvailable: true },
  { name: 'Cordless Drill', category: 'Power Tools', condition: 'good', isAvailable: true },
  { name: 'Screwdriver Set', category: 'Hand Tools', condition: 'good', isAvailable: true },
  { name: 'Jigsaw', category: 'Power Tools', condition: 'good', isAvailable: true },
  { name: 'Circular Saw', category: 'Power Tools', condition: 'worn', isAvailable: true },
  { name: 'Paint Roller', category: 'Painting', condition: 'new', isAvailable: false },
  { name: 'Paint Brush', category: 'Painting', condition: 'good', isAvailable: true },
  { name: 'Allen Key Set', category: 'Hand Tools', condition: 'good', isAvailable: true },
  { name: 'Adjustable Wrench', category: 'Hand Tools', condition: 'good', isAvailable: true },
  { name: 'Tape Measure', category: 'Measuring', condition: 'good', isAvailable: true }
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in backend/.env first.');
  }

  await mongoose.connect(mongoUri);

  const result = {
    created: 0,
    skipped: 0,
  };

  for (const tool of demoTools) {
    const existing = await Tool.findOne({
      name: tool.name,
      category: tool.category,
    });

    if (existing) {
      result.skipped += 1;
      continue;
    }

    await Tool.create(tool);
    result.created += 1;
  }

  const total = await Tool.countDocuments({});

  console.log('Seed completed');
  console.log(`Created: ${result.created}`);
  console.log(`Skipped (already existed): ${result.skipped}`);
  console.log(`Total tools in database: ${total}`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // noop
  }
  process.exit(1);
});
