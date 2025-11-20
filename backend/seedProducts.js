// backend/seedProducts.js
// Uses @faker-js/faker to generate realistic agricultural product data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for seeding products');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Comprehensive product list with realistic Kenyan agricultural products
        const productData = [
            // Vegetables (8 products)
            { name: 'Tomatoes', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Onions', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Cabbage', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Carrots', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Spinach', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Green Peppers', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Broccoli', category_type: 'Vegetables', unit: 'KES/kg' },
            { name: 'Lettuce', category_type: 'Vegetables', unit: 'KES/bunch' },
            
            // Cereals (7 products)
            { name: 'Maize', category_type: 'Cereals', unit: 'KES/90kg Bag' },
            { name: 'Wheat', category_type: 'Cereals', unit: 'KES/90kg Bag' },
            { name: 'Rice', category_type: 'Cereals', unit: 'KES/kg' },
            { name: 'Sorghum', category_type: 'Cereals', unit: 'KES/kg' },
            { name: 'Millet', category_type: 'Cereals', unit: 'KES/kg' },
            { name: 'Finger Millet', category_type: 'Cereals', unit: 'KES/kg' },
            { name: 'Barley', category_type: 'Cereals', unit: 'KES/kg' },
            
            // Fruits (8 products)
            { name: 'Bananas', category_type: 'Fruits', unit: 'KES/bunch' },
            { name: 'Mangoes', category_type: 'Fruits', unit: 'KES/kg' },
            { name: 'Oranges', category_type: 'Fruits', unit: 'KES/kg' },
            { name: 'Avocados', category_type: 'Fruits', unit: 'KES/kg' },
            { name: 'Watermelon', category_type: 'Fruits', unit: 'KES/piece' },
            { name: 'Pineapples', category_type: 'Fruits', unit: 'KES/piece' },
            { name: 'Papayas', category_type: 'Fruits', unit: 'KES/kg' },
            { name: 'Passion Fruit', category_type: 'Fruits', unit: 'KES/kg' },
            
            // Pulses (7 products)
            { name: 'Beans', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Lentils', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Chickpeas', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Peas', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Pigeon Peas', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Cowpeas', category_type: 'Pulses', unit: 'KES/kg' },
            { name: 'Soya Beans', category_type: 'Pulses', unit: 'KES/kg' },
            
            // Dairy Products (4 products)
            { name: 'Fresh Milk', category_type: 'Dairy Products', unit: 'KES/litre' },
            { name: 'Yogurt', category_type: 'Dairy Products', unit: 'KES/500ml' },
            { name: 'Cheese', category_type: 'Dairy Products', unit: 'KES/kg' },
            { name: 'Butter', category_type: 'Dairy Products', unit: 'KES/kg' },
            
            // Tubers (5 products)
            { name: 'Potatoes', category_type: 'Tubers', unit: 'KES/kg' },
            { name: 'Sweet Potatoes', category_type: 'Tubers', unit: 'KES/kg' },
            { name: 'Cassava', category_type: 'Tubers', unit: 'KES/kg' },
            { name: 'Yams', category_type: 'Tubers', unit: 'KES/kg' },
            { name: 'Arrowroot', category_type: 'Tubers', unit: 'KES/kg' }
        ];

        const createdProducts = await Product.insertMany(productData);
        console.log(`✅ Seeded ${createdProducts.length} products across 6 categories`);
        
        // Group by category for display
        const byCat = {};
        createdProducts.forEach(p => {
            if (!byCat[p.category_type]) byCat[p.category_type] = [];
            byCat[p.category_type].push(p.name);
        });
        
        Object.entries(byCat).forEach(([cat, prods]) => {
            console.log(`  📦 ${cat} (${prods.length}): ${prods.join(', ')}`);
        });

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error.message);
        process.exit(1);
    }
};

seedProducts();
