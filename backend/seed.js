// backend/seed.js - Expanded and Categorized for Shambani

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MarketTrend = require('./models/MarketTrend');

dotenv.config();
const mongoURI = process.env.MONGO_URI; 

const generateHistoricalPrices = (startPrice, days, fluctuationFactor = 0.05) => {
    // ... (keep the existing helper function logic here)
    const data = [];
    let currentPrice = startPrice;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        currentPrice += (Math.random() - 0.5) * currentPrice * fluctuationFactor;
        if (currentPrice < 1) currentPrice = 1; 
        data.push({
            date: date,
            price: parseFloat(currentPrice.toFixed(2))
        });
    }
    return data;
};

const trendData = [
    // --- STAPLE GRAINS ---
    {
        commodity: 'Dry Maize (Unground)',
        category: 'Staple Grains',
        region: 'Eldoret Market, Uasin Gishu',
        unit: 'KES/90kg Bag',
        currentPrice: 3850.00,
        historicalPrices: generateHistoricalPrices(3800.00, 10, 0.02),
    },
    {
        commodity: 'Wheat Grain',
        category: 'Staple Grains',
        region: 'Nanyuki Cereal Board',
        unit: 'KES/50kg Bag',
        currentPrice: 2450.00,
        historicalPrices: generateHistoricalPrices(2500.00, 10, 0.01),
    },
    // --- HORTICULTURE ---
    {
        commodity: 'Potatoes (Washed)',
        category: 'Horticulture',
        region: 'Wakulima Market, Nairobi',
        unit: 'KES/kg',
        currentPrice: 85.00,
        historicalPrices: generateHistoricalPrices(95.00, 10, 0.05), 
    },
    {
        commodity: 'Cabbages',
        category: 'Horticulture',
        region: 'Horticultural Market, Nakuru',
        unit: 'KES/piece (Average)',
        currentPrice: 55.00,
        historicalPrices: generateHistoricalPrices(50.00, 10, 0.03),
    },
    {
        commodity: 'Red Onions',
        category: 'Horticulture',
        region: 'Kongowea Market, Mombasa',
        unit: 'KES/kg',
        currentPrice: 125.00,
        historicalPrices: generateHistoricalPrices(110.00, 10, 0.06),
    },
    {
        commodity: 'Ripe Mangoes (Bata)',
        category: 'Horticulture',
        region: 'Machakos Market',
        unit: 'KES/piece',
        currentPrice: 30.00,
        historicalPrices: generateHistoricalPrices(35.00, 10, 0.04),
    },
    // --- HIGH-VALUE / LIVESTOCK FEED ---
    {
        commodity: 'Fresh Avocados (Hass)',
        category: 'High-Value/Exports',
        region: 'Murang\'a County',
        unit: 'KES/piece (Export Grade)',
        currentPrice: 45.00,
        historicalPrices: generateHistoricalPrices(40.00, 10, 0.08),
    },
    {
        commodity: 'Soybean Meal',
        category: 'Livestock Feed',
        region: 'Industrial Area, Nairobi',
        unit: 'KES/kg',
        currentPrice: 78.00,
        historicalPrices: generateHistoricalPrices(80.00, 10, 0.01),
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await MarketTrend.deleteMany({});
        console.log('Old data cleared.');

        // Insert new data
        await MarketTrend.insertMany(trendData);
        console.log(`Database successfully seeded with ${trendData.length} market items! 🌱`);

    } catch (error) {
        console.error('ERROR SEEDING DATABASE:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

seedDB();