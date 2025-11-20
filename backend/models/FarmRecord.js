// backend/models/FarmRecord.js

const mongoose = require('mongoose');

const FarmRecordSchema = new mongoose.Schema({
    // Link this record directly to the User who created it (CRITICAL for security)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commodity: {
        type: String,
        required: true,
        trim: true
    },
    recordType: {
        type: String,
        enum: ['Stock', 'Sale', 'Input'], // Define allowed types
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String, // e.g., 'kg', 'bag', 'units'
        required: true
    },
    price: { // Price per unit or total cost
        type: Number,
        default: 0
    },
    dateRecorded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('FarmRecord', FarmRecordSchema);