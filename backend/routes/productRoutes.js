// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// @route GET /api/products/byCategory/:categoryId
// @desc Get all products belonging to a specific category
// @access Public
router.get('/byCategory/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;

        // First, verify the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Find all products with matching category_type
        const products = await Product.find({ category_type: category.name }).sort({ name: 1 });

        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ msg: 'Server error fetching products' });
    }
});

module.exports = router;
