// backend/seedDealers.js - Expanded AgroDealer data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AgroDealer = require('./models/AgroDealer');

dotenv.config();
const mongoURI = process.env.MONGO_URI; 

const dealerData = [
    {
        name: 'Kilimo Bora Agrovet',
        county: 'Kiambu',
        inventory: ['Maize Seed (Hybrid)', 'NPK Fertilizer', 'General Supplies'],
        contact: '0711-222-333',
        location: { type: 'Point', coordinates: [36.980, -1.150] } 
    },
    {
        name: 'Mavuno Agro Supplies',
        county: 'Nakuru',
        inventory: ['Potato Seed', 'DAP Fertilizer', 'Crop Protection'],
        contact: '0722-111-444',
        location: { type: 'Point', coordinates: [36.080, -0.280] } 
    },
    {
        name: 'Pwani Quality Inputs',
        county: 'Mombasa',
        inventory: ['Vegetable Seeds', 'Organic Manure', 'General Supplies'],
        contact: '0733-555-666',
        location: { type: 'Point', coordinates: [39.660, -4.050] } 
    },
    {
        name: 'Trans Nzoia Seed Hub',
        county: 'Trans Nzoia',
        inventory: ['Wheat Seed', 'Seeds & Fertilizer', 'Crop Protection'],
        contact: '0744-777-888',
        location: { type: 'Point', coordinates: [34.990, 1.010] } 
    },
    {
        name: 'Kericho Crop Experts',
        county: 'Kericho',
        inventory: ['Seeds & Fertilizer', 'Crop Protection', 'Tea Supplies'],
        contact: '0755-999-000',
        location: { type: 'Point', coordinates: [35.360, -0.360] } 
    },
    {
        name: 'Kisumu Poultry Focus',
        county: 'Kisumu',
        inventory: ['General Supplies', 'Poultry Feed', 'Crop Protection'],
        contact: '0766-888-111',
        location: { type: 'Point', coordinates: [34.760, -0.100] } 
    },
];

const seedDealersDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected for Seeding Dealers...');

        await AgroDealer.deleteMany({});
        console.log('Old agro-dealer data cleared.');

        await AgroDealer.insertMany(dealerData);
        console.log(`Agro-Dealer database successfully seeded with ${dealerData.length} items! 🚜`);

    } catch (error) {
        console.error('ERROR SEEDING AGRO-DEALER DATABASE:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

seedDealersDB();