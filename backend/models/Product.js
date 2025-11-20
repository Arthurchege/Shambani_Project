// backend/models/Product.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category_type: {
        type: String,
        required: true,
        trim: true
    },
    unit: {
        type: String,
        required: true,
        trim: true
        // e.g., 'KES/kg', 'KES/90kg Bag', 'KES/unit'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
