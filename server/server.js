require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devops-dashboard';

// ── Database ──────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Running without DB — auth routes will not work');
  });

// ── Middleware ────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', systemRoutes);      // /api/stats  — protected inside the router

// ── Health check ─────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'DevOps Dashboard API running' }));

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
