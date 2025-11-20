// backend/models/MarketPrice.js

const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    market_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Market',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
