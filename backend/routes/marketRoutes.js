// backend/routes/marketRoutes.js

const express = require('express');
const router = express.Router();
const Market = require('../models/Market');
const MarketPrice = require('../models/MarketPrice');

// @route GET /api/markets/:marketId
// @desc Get all products listed at a single market location
// @access Public
router.get('/:marketId', async (req, res) => {
    try {
        const { marketId } = req.params;

        // Verify market exists
        const market = await Market.findById(marketId);
        if (!market) {
            return res.status(404).json({ msg: 'Market not found' });
        }

        // Get all prices for this market, populated with product details
        const prices = await MarketPrice.find({ market_id: marketId })
            .populate('product_id', 'name category_type unit')
            .sort({ 'product_id.name': 1 });

        res.json({
            market: market,
            products: prices
        });
    } catch (error) {
        console.error('Error fetching market details:', error);
        res.status(500).json({ msg: 'Server error fetching market details' });
    }
});

// @route GET /api/markets
// @desc Get all markets
// @access Public
router.get('/', async (req, res) => {
    try {
        const markets = await Market.find().sort({ county: 1, name: 1 });
        res.json(markets);
    } catch (error) {
        console.error('Error fetching markets:', error);
        res.status(500).json({ msg: 'Server error fetching markets' });
    }
});

module.exports = router;
