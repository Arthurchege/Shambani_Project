// backend/routes/dealerRoutes.js

const express = require('express');
const router = express.Router();
const AgroDealer = require('../models/AgroDealer');
const auth = require('../middleware/auth');

// @route GET /api/dealers
// @desc Get all agro-dealers (protected route)
router.get('/', auth, async (req, res) => {
    try {
        // For simplicity, we fetch all dealers. In a real app, you'd filter by location.
        const dealers = await AgroDealer.find({});
        res.json(dealers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/dealers/search?county=Nairobi
// @desc Get dealers by county (protected route)
router.get('/search', auth, async (req, res) => {
    try {
        const { county } = req.query;
        if (!county) {
            return res.status(400).json({ msg: 'County query parameter is required' });
        }

        const dealers = await AgroDealer.find({ 
            county: new RegExp(county, 'i') // Case-insensitive county search
        });

        res.json(dealers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;