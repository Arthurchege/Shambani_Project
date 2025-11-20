// backend/server.js - FINALIZED with ALL Comprehensive Routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// 1. Import ALL Route Handlers
const authRoutes = require('./routes/authRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const recordRoutes = require('./routes/recordRoutes'); // <-- Farm Records Route
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

// Socket authentication: verify JWT on connect and attach user info to socket
const jwt = require('jsonwebtoken');
const User = require('./models/User');

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth && socket.handshake.auth.token
            ? socket.handshake.auth.token
            : (socket.handshake.query && socket.handshake.query.token ? socket.handshake.query.token : null);

        // Allow unauthenticated connections (for public browsing)
        if (!token) {
            // User is not authenticated but can still receive broadcasts
            socket.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded && decoded.user && decoded.user.id ? decoded.user.id : null;
        if (!userId) {
            // Invalid token but allow connection
            socket.user = null;
            return next();
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            // User not found but allow connection
            socket.user = null;
            return next();
        }

        // Attach user object to the socket
        socket.user = { id: user.id, email: user.email, role: user.role };
        return next();
    } catch (err) {
        console.error('Socket authentication error:', err.message || err);
        // Allow connection even if auth fails (graceful degradation)
        socket.user = null;
        return next();
    }
});

// 2. Middleware
app.use(cors()); 
app.use(express.json()); // Allows parsing JSON body data

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error. Check MONGO_URI in .env:', err.message);
        if (process.env.NODE_ENV === 'test') {
            // During tests, throw the error so the test runner can handle it
            throw err;
        }
        process.exit(1); // Exit process with failure
    });

// 4. Mount ALL API Routes (New Comprehensive Features)
app.use('/api/auth', authRoutes);    // Authentication: /api/auth/register, /api/auth/login
app.use('/api/dealers', dealerRoutes); // Farm Input Locator
app.use('/api/records', recordRoutes); // Personalized Farm Records (CRUD)
app.use('/api/categories', categoryRoutes); // Product Categories
app.use('/api/products', productRoutes); // Products
app.use('/api/markets', marketRoutes); // Markets
app.use('/api/prices', priceRoutes); // Market Prices & Comparisons

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