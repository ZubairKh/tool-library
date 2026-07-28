require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tools', require('./routes/tools')(prisma));
app.use('/api/bookings', require('./routes/bookings')(prisma));

app.listen(process.env.PORT, () => console.log(`API on http://localhost:${process.env.PORT}`));