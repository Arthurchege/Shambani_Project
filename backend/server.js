// backend/server.js - FINAL PRODUCTION FIX with Socket.io and Expansion Routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// --- CRITICAL DEPLOYMENT FIX START ---
// Only load variables from a local .env file IF NOT running in production.
// This prevents the deployed server from reading the local 'localhost:27017' URI,
// forcing it to use the correct MONGO_URI set in the Railway/Render dashboard variables.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
// --- CRITICAL DEPLOYMENT FIX END ---

// 1. Import ALL Route Handlers
const authRoutes = require('./routes/authRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const recordRoutes = require('./routes/recordRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const marketRoutes = require('./routes/marketRoutes');
const priceRoutes = require('./routes/priceRoutes');

const MarketTrend = require('./models/MarketTrend'); // Existing Market Data Model

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Make io available to routes via app.get('io')
app.set('io', io);

// Socket authentication modules
const jwt = require('jsonwebtoken');
const User = require('./models/User');

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth && socket.handshake.auth.token
            ? socket.handshake.auth.token
            : (socket.handshake.query && socket.handshake.query.token ? socket.handshake.query.token : null);

        // Allow unauthenticated connections (for public browsing)
        if (!token) {
            socket.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded && decoded.user && decoded.user.id ? decoded.user.id : null;
        if (!userId) {
            socket.user = null;
            return next();
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            socket.user = null;
            return next();
        }

        // Attach user object to the socket
        socket.user = { id: user.id, role: user.role }; // Assumes User model has 'role'
        return next();
    } catch (err) {
        console.error('Socket authentication error:', err.message || err);
        socket.user = null;
        return next();
    }
});

// 2. Middleware
app.use(cors({
    origin: [
        'https://shambaniproject.netlify.app',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json()); // Allows parsing JSON body data

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI) // Reads MONGO_URI from the environment variables
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        // Updated error message to guide troubleshooting
        console.error('❌ MongoDB Connection Error. Verify MONGO_URI in Railway/Render Variables:', err.message);
        if (process.env.NODE_ENV === 'test') {
            throw err;
        }
        process.exit(1); // Exit process with failure
    });

// 4. Mount ALL API Routes (New Comprehensive Features)
app.use('/api/auth', authRoutes); 
app.use('/api/dealers', dealerRoutes); 
app.use('/api/records', recordRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/markets', marketRoutes); 
app.use('/api/prices', priceRoutes); 

// 5. Existing Market Trends Route (Public - Shambani Home Page)
app.get('/api/trends', async (req, res) => {
    try {
        const trends = await MarketTrend.find({}).sort({ commodity: 1 }); 
        res.json(trends);
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ message: 'Server error fetching market data.' });
    }
});

// Simple default route
app.get('/', (req, res) => {
    res.send('Shambani API is running!');
});

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`📡 Server running on port ${PORT}`);
    });
}

// Export the Express app for tests and also expose io/server for runtime usage
module.exports = app;
module.exports.io = io;
module.exports.server = server;