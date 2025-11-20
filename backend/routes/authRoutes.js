// backend/routes/authRoutes.js - FINALIZED with Role Inclusion in JWT

const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Helper to create the JWT token, now accepting the user's role
const createToken = (userId, role) => { 
    const payload = {
        user: {
            id: userId,
            role: role // CRITICAL: Embeds the role into the token payload
        },
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); 
};

// @route POST /api/auth/register
// @desc Register a user
router.post('/register', async (req, res) => {
    // Note: New user's role defaults to 'farmer'
    const { email, password, location } = req.body; 

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already registered' });
        }

        user = new User({ email, password, location });
        await user.save(); 

        // Generate token using the newly created user's default role ('farmer')
        const token = createToken(user.id, user.role); 
        
        // Respond with the token, email, and role
        res.json({ token, email: user.email, role: user.role, location: user.location });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST /api/auth/login
// @desc Authenticate user & get token (Handles the RBAC token update)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // CRITICAL FIX: Ensure the role is passed, defaulting to 'farmer' if somehow undefined
        // This ensures a role is always included in the token.
        const currentRole = user.role || 'farmer'; 
        
        // Generate NEW token with the user's CURRENT role from the DB
        const token = createToken(user.id, currentRole); 
        
        // Respond with the token, email, and actual role
        res.json({ token, email: user.email, role: currentRole, location: user.location });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;