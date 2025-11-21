// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

const MarketTrend = require('../models/MarketTrend');
const AgroDealer = require('../models/AgroDealer');
const { trendData } = require('../seed');
const { dealerData } = require('../seedDealers');

// Protect this route using a seed key stored in environment variables.
// Set `SEED_KEY` in your Render environment variables to a strong secret.
router.post('/seed', async (req, res) => {
  const provided = req.headers['x-seed-key'] || req.body.seedKey;
  if (!process.env.SEED_KEY) {
    return res.status(500).json({ msg: 'Server not configured for seeding (SEED_KEY missing).' });
  }

  if (!provided || provided !== process.env.SEED_KEY) {
    return res.status(401).json({ msg: 'Unauthorized: invalid seed key.' });
  }

  try {
    // Use existing mongoose connection (do not close it)
    await MarketTrend.deleteMany({});
    await MarketTrend.insertMany(trendData);

    await AgroDealer.deleteMany({});
    await AgroDealer.insertMany(dealerData);

    return res.json({ msg: 'Seeding completed', trends: trendData.length, dealers: dealerData.length });
  } catch (err) {
    console.error('Seeding error:', err);
    return res.status(500).json({ msg: 'Seeding failed', error: err.message });
  }
});

module.exports = router;
