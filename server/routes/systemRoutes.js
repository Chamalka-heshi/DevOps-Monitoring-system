const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSystemStats } = require('../utils/system');

// ── GET /api/stats — protected ────────────────────────────
// authMiddleware is applied once here (NOT also in server.js)
router.get('/stats', authMiddleware, (req, res) => {
  res.json(getSystemStats());
});

module.exports = router;
