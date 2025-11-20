// backend/models/Market.js

const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    county: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        default: ''
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
MarketSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Market', MarketSchema);
