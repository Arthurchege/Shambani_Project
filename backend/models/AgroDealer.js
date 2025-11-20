// backend/models/AgroDealer.js

const mongoose = require('mongoose');

const AgroDealerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    county: {
        type: String,
        required: true,
    },
    inventory: [{ // Simple list of inputs they stock
        type: String
    }],
    contact: {
        type: String,
        required: true
    },
    // GeoJSON for mapping and proximity search (requires MongoDB index)
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: { // [longitude, latitude]
            type: [Number], 
            required: true
        }
    }
}, { timestamps: true });

// Create a 2dsphere index for geospatial queries (Mongoose requirement)
AgroDealerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('AgroDealer', AgroDealerSchema);