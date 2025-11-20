// backend/routes/priceRoutes.js

const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');
const Product = require('../models/Product');
const Market = require('../models/Market');
const auth = require('../middleware/auth');

// @route GET /api/prices/product/:productId
// @desc Return a comparison table of all market prices for a single product
// @access Public
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Get all prices for this product, populated with market details
        const prices = await MarketPrice.find({ product_id: productId })
            .populate('market_id', 'name county contact')
            .sort({ 'market_id.county': 1, 'market_id.name': 1 });

        res.json({
            product: product,
            priceComparison: prices
        });
    } catch (error) {
        console.error('Error fetching price comparison:', error);
        res.status(500).json({ msg: 'Server error fetching price comparison' });
    }
});

// @route GET /api/prices/market/:marketId
// @desc Return all product prices listed at a single market location
// @access Public
router.get('/market/:marketId', async (req, res) => {
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
            prices: prices
        });
    } catch (error) {
        console.error('Error fetching market prices:', error);
        res.status(500).json({ msg: 'Server error fetching market prices' });
    }
});

// @route POST /api/prices
// @desc Create a new market price and broadcast to connected clients
// @access Private (requires auth middleware)
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, market_id, price } = req.body;

        if (!product_id || !market_id || price == null) {
            return res.status(400).json({ msg: 'product_id, market_id and price are required' });
        }

        // Verify product and market exist
        const product = await Product.findById(product_id);
        const market = await Market.findById(market_id);
        if (!product || !market) {
            return res.status(404).json({ msg: 'Invalid product or market' });
        }

        const newPrice = new MarketPrice({ product_id, market_id, price });
        const saved = await newPrice.save();

        // Populate the saved price for richer payload
        const populated = await MarketPrice.findById(saved._id)
            .populate('product_id', 'name category_type unit')
            .populate('market_id', 'name county contact');

        // Emit socket event if io is available
        const io = req.app.get('io');
        if (io) {
            io.emit('priceUpdate', populated);
        }

        res.json(populated);
    } catch (error) {
        console.error('Error creating market price:', error);
        res.status(500).json({ msg: 'Server error creating market price' });
    }
});

module.exports = router;

