// backend/seedPrices.js
// Uses @faker-js/faker to generate realistic market price data with relational integrity

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const MarketPrice = require('./models/MarketPrice');
const Product = require('./models/Product');
const Market = require('./models/Market');

dotenv.config();

const seedPrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for seeding prices');

        // Clear existing prices
        await MarketPrice.deleteMany({});
        console.log('🗑️  Cleared existing prices');

        // Fetch all products and markets
        const products = await Product.find();
        const markets = await Market.find();

        if (products.length === 0) {
            console.error('❌ No products found. Please run seedProducts.js first');
            process.exit(1);
        }

        if (markets.length === 0) {
            console.error('❌ No markets found. Please run seedMarkets.js first');
            process.exit(1);
        }

        console.log(`📦 Found ${products.length} products and 📍 ${markets.length} markets`);

        // Generate realistic price entries with faker
        const prices = [];
        const priceStats = {};

        products.forEach(product => {
            markets.forEach(market => {
                // Generate realistic base prices based on category
                let basePrice = 0;
                switch (product.category_type) {
                    case 'Vegetables':
                        basePrice = faker.number.int({ min: 40, max: 150 }); // KES/kg
                        break;
                    case 'Cereals':
                        if (product.unit.includes('90kg')) {
                            basePrice = faker.number.int({ min: 3000, max: 5000 }); // KES/bag
                        } else {
                            basePrice = faker.number.int({ min: 30, max: 80 }); // KES/kg
                        }
                        break;
                    case 'Fruits':
                        basePrice = faker.number.int({ min: 60, max: 200 }); // KES/kg
                        break;
                    case 'Pulses':
                        basePrice = faker.number.int({ min: 80, max: 200 }); // KES/kg
                        break;
                    case 'Dairy Products':
                        basePrice = faker.number.int({ min: 100, max: 250 }); // KES/unit
                        break;
                    case 'Tubers':
                        basePrice = faker.number.int({ min: 30, max: 120 }); // KES/kg
                        break;
                    default:
                        basePrice = faker.number.int({ min: 50, max: 150 });
                }

                // Apply regional market variations using faker randomness
                let marketPrice = basePrice;
                const variation = faker.number.float({ min: -0.15, max: 0.15 }); // ±15% variation

                // Coastal markets (Mombasa) tend to be slightly higher
                if (market.county === 'Mombasa') {
                    marketPrice = basePrice * (1 + 0.08 + variation);
                }
                // Rural markets (Kisumu, Kajiado) tend to be lower
                else if (market.county === 'Kisumu' || market.county === 'Kajiado') {
                    marketPrice = basePrice * (1 - 0.08 + variation);
                }
                // Urban markets (Nairobi, Nakuru, Uasin Gishu) moderate pricing
                else {
                    marketPrice = basePrice * (1 + variation);
                }

                // Round to nearest whole number for realistic pricing
                marketPrice = Math.round(marketPrice);

                // Record statistics for display
                const key = `${product.name} (${market.county})`;
                priceStats[key] = marketPrice;

                prices.push({
                    product_id: product._id,
                    market_id: market._id,
                    price: marketPrice,
                    date: faker.date.recent({ days: 30 }) // Prices from last 30 days
                });
            });
        });

        const createdPrices = await MarketPrice.insertMany(prices);
        console.log(`✅ Seeded ${createdPrices.length} market price entries`);
        
        // Display some sample prices
        console.log('\n📊 Sample prices (randomized from seeded data):');
        const sampleKeys = Object.keys(priceStats).slice(0, 8);
        sampleKeys.forEach(key => {
            console.log(`  ${key}: KES ${priceStats[key]}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding prices:', error.message);
        process.exit(1);
    }
};

seedPrices();
