require('dotenv').config(); // Tambahkan ini di paling atas
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const db = require('./models'); // pastikan ./models/index.js ada
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000; // Perbaiki inisialisasi PORT

// Middleware
app.use(bodyParser.json());

// Logger (letakkan sebelum routes)
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`→ [${req.method}] ${req.originalUrl}`);
  if (Object.keys(req.body).length > 0) {
    console.log('  Request Body:', JSON.stringify(req.body));
  }

  // Log response status & time
  res.on('finish', () => {
    console.log(`← [${res.statusCode}] ${req.method} ${req.originalUrl} (${Date.now() - start}ms)`);
  });
  next();
});

// Routes
app.use('/auth', authRoutes);
// Logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`→ Request: [${req.method}] ${req.originalUrl}`);
  res.on('finish', () => {
    console.log(`← Response: [${res.statusCode}] ${req.method} ${req.originalUrl} (${Date.now() - start}ms)`);
  });
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Sync DB and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});