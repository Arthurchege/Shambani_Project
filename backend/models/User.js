// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: { // <-- NEW ROLE FIELD
        type: String,
        enum: ['farmer', 'data_entry', 'admin'],
        default: 'farmer'
    },
    location: {
        type: String,
        default: 'Nairobi' 
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);