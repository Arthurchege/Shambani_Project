// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
    // 1. Check for token in the Authorization header
    const token = req.header('x-auth-token');

    if (!token) {
        // 401: Unauthorized access
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 2. Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user payload (user ID) to the request object
        req.user = decoded.user;
        next(); // Proceed to the route handler
    } catch (err) {
        // Token is invalid or expired
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;