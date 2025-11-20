// backend/seedCategories.js
// Uses @faker-js/faker to generate realistic product categories

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Category = require('./models/Category');

dotenv.config();

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for seeding categories');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Define fixed categories for agriculture
        const categories = [
            { name: 'Vegetables', type: 'Product', sort_order: 1 },
            { name: 'Cereals', type: 'Product', sort_order: 2 },
            { name: 'Fruits', type: 'Product', sort_order: 3 },
            { name: 'Pulses', type: 'Product', sort_order: 4 },
            { name: 'Dairy Products', type: 'Product', sort_order: 5 },
            { name: 'Tubers', type: 'Product', sort_order: 6 }
        ];

        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Seeded ${createdCategories.length} product categories`);
        console.log('📋 Categories:', createdCategories.map(c => c.name).join(', '));

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error.message);
        process.exit(1);
    }
};

seedCategories();
