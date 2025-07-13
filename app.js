require('dotenv').config(); // Tambahkan ini di paling atas
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const db = require('./models'); // pastikan ./models/index.js ada
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileroutes');
const locationRoutes = require('./routes/location');
const path = require('path');
const reportRoutes = require('./routes/illegalReportRoutes');
const subscribeRoutes = require('./routes/subscriptionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();
const PORT = process.env.PORT || 3000; // Perbaiki inisialisasi PORT

// Middleware
app.use(bodyParser.json());

// Logger (letakkan sebelum routes)
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`→ [${req.method}] ${req.originalUrl}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log('  Request Body:', JSON.stringify(req.body));
  }
  res.on('finish', () => {
    console.log(`← [${res.statusCode}] ${req.method} ${req.originalUrl} (${Date.now() - start}ms)`);
  });
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/location', locationRoutes);
app.use('/reports', reportRoutes);
app.use('/subscriptions', subscribeRoutes);
app.use('/transactions', transactionRoutes);
// Logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`→ Request: [${req.method}] ${req.originalUrl}`);
  res.on('finish', () => {
    console.log(`← Response: [${res.statusCode}] ${req.method} ${req.originalUrl} (${Date.now() - start}ms)`);
  });
  next();
});

// Serve static files dari folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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