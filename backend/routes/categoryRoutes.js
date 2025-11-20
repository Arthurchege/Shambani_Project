// backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route GET /api/categories
// @desc Return all categories for initial navigation
// @access Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ sort_order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ msg: 'Server error fetching categories' });
    }
});

module.exports = router;
