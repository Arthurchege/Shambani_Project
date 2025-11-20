// backend/seedMarkets.js
// Uses @faker-js/faker to generate realistic market data with authentic Kenyan locations

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Market = require('./models/Market');

dotenv.config();

const seedMarkets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for seeding markets');

        // Clear existing markets
        await Market.deleteMany({});
        console.log('🗑️  Cleared existing markets');

        // Kenyan counties and their coordinates
        const kenyaMarkets = [
            {
                name: 'Wakulima Market',
                county: 'Nairobi',
                coordinates: [36.8172, -1.2921], // [longitude, latitude]
                contact: '0712345678'
            },
            {
                name: 'Nakumatt Trading Centre',
                county: 'Kiambu',
                coordinates: [36.7516, -1.1718],
                contact: '0701234567'
            },
            {
                name: 'Mombasa Central Market',
                county: 'Mombasa',
                coordinates: [39.6652, -4.0435],
                contact: '0713567890'
            },
            {
                name: 'Kisumu Trading Centre',
                county: 'Kisumu',
                coordinates: [34.7680, -0.1022],
                contact: '0722890123'
            },
            {
                name: faker.company.name() + ' Market',
                county: 'Nakuru',
                coordinates: [36.0726, -0.3031],
                contact: faker.phone.number('07########')
            },
            {
                name: faker.company.name() + ' Hub',
                county: 'Kajiado',
                coordinates: [36.7674, -2.1833],
                contact: faker.phone.number('07########')
            },
            {
                name: faker.company.name() + ' Market',
                county: 'Uasin Gishu',
                coordinates: [35.2876, 0.5143],
                contact: faker.phone.number('07########')
            }
        ];

        const markets = kenyaMarkets.map(market => ({
            name: market.name,
            county: market.county,
            contact: market.contact,
            location: {
                type: 'Point',
                coordinates: market.coordinates
            }
        }));

        const createdMarkets = await Market.insertMany(markets);
        console.log(`✅ Seeded ${createdMarkets.length} markets across ${new Set(kenyaMarkets.map(m => m.county)).size} counties`);
        console.log('📍 Markets:', createdMarkets.map(m => `${m.name} (${m.county})`).join('\n   '));

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding markets:', error.message);
        process.exit(1);
    }
};

seedMarkets();
