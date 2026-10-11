require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// IP added to mongoDB -- 89.247.165.89
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tools', require('./routes/recommendations').createRecommendationsRouter());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.use('/api/tools', require('./routes/tools'));
    app.listen(process.env.PORT, () => console.log(`API on http://localhost:${process.env.PORT}`));
  })
  .catch(err => console.error('Mongo connection error:', err));