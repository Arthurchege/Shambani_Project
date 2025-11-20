// backend/models/MarketTrend.js

const mongoose = require('mongoose');

// Sub-schema for historical price data points (required for the chart)
const PricePointSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 }
}, { _id: false });

// Main schema for a single commodity trend
const MarketTrendSchema = new mongoose.Schema({
    commodity: { type: String, required: true, unique: true },
    category: { type: String, required: true }, 
    region: { type: String, required: true },    
    unit: { type: String, required: true },      
    currentPrice: { type: Number, required: true, min: 0 }, 
    historicalPrices: { 
        type: [PricePointSchema], 
        default: [] 
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('MarketTrend', MarketTrendSchema);