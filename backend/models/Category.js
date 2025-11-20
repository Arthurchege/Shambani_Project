// backend/models/Category.js

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Product', 'Market'],
        required: true
    },
    sort_order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
