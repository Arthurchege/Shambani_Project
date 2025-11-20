# 🎭 Faker Integration Guide - Shambani Project

## Overview

The Shambani project now uses **@faker-js/faker** to generate realistic, relational test data across all seeding scripts. This ensures that data is:

- ✅ **Realistic** - Uses actual Kenyan market names, counties, and agricultural products
- ✅ **Relational** - Products, Markets, and Prices are properly linked with IDs
- ✅ **Varied** - Market-specific price variations reflect real-world dynamics
- ✅ **Reproducible** - Seeders can be run multiple times with fresh data

---

## Installation

The `@faker-js/faker` package is already installed via `npm install`. If you need to reinstall:

```bash
cd backend
npm install @faker-js/faker@^8.4.1
```

---

## Seeding Scripts Structure

### 1. **seedCategories.js** - Product Categories

**Purpose:** Creates fixed agricultural categories for product organization

**Data Generated:**

- 6 categories with sort order
- Categories: Vegetables, Cereals, Fruits, Pulses, Dairy Products, Tubers
- Type: All marked as 'Product' type

**Relational Role:**

- Source model for Product references
- Must run **first**

**Key Faker Usage:**

```javascript
// Fixed categories (no faker randomization)
const categories = [
  { name: "Vegetables", type: "Product", sort_order: 1 },
  // ... more categories
];
```

**Sample Output:**

```
✅ Seeded 6 product categories
📋 Categories: Vegetables, Cereals, Fruits, Pulses, Dairy Products, Tubers
```

---

### 2. **seedMarkets.js** - Market Locations

**Purpose:** Creates Kenyan market locations with authentic geographic data

**Data Generated:**

- 7 markets across 7 counties
- Realistic coordinates using GeoJSON Point format
- Faker-generated market names (using `faker.company.name()`)
- Faker-generated contact numbers (using `faker.phone.number()`)

**Relational Role:**

- Referenced by MarketPrice entries
- Must run **second** (after categories)

**Key Faker Usage:**

```javascript
// Realistic contact numbers
contact: faker.phone.number("07########");

// Realistic market names
name: faker.company.name() + " Market";
```

**Geographic Data:**
| Market | County | Coordinates |
|--------|--------|-------------|
| Wakulima Market | Nairobi | [36.8172, -1.2921] |
| Nakumatt Trading Centre | Kiambu | [36.7516, -1.1718] |
| Mombasa Central Market | Mombasa | [39.6652, -4.0435] |
| Kisumu Trading Centre | Kisumu | [34.7680, -0.1022] |
| (Faker Generated) | Nakuru | [36.0726, -0.3031] |
| (Faker Generated) | Kajiado | [36.7674, -2.1833] |
| (Faker Generated) | Uasin Gishu | [35.2876, 0.5143] |

**2dsphere Index:**
All market locations use GeoJSON Point format for geospatial indexing.

**Sample Output:**

```
✅ Seeded 7 markets across 7 counties
📍 Markets: Wakulima Market (Nairobi)
   Nakumatt Trading Centre (Kiambu)
   ...
   Heathcote Group Market (Uasin Gishu)
```

---

### 3. **seedProducts.js** - Agricultural Products

**Purpose:** Creates realistic Kenyan agricultural products with units

**Data Generated:**

- 39 products across 6 categories
- Realistic product names (tomatoes, maize, bananas, etc.)
- Appropriate units for each product (KES/kg, KES/bunch, etc.)

**Relational Role:**

- Referenced by MarketPrice entries
- Must run **third** (after categories)

**Key Data Structure:**

```javascript
// Fixed product definitions (no faker randomization)
const productData = [
  // Vegetables (8)
  { name: "Tomatoes", category_type: "Vegetables", unit: "KES/kg" },

  // Cereals (7)
  { name: "Maize", category_type: "Cereals", unit: "KES/90kg Bag" },

  // Fruits (8)
  { name: "Bananas", category_type: "Fruits", unit: "KES/bunch" },

  // ... more products
];
```

**Categories & Products:**
| Category | Product Count | Examples |
|----------|---------------|----------|
| Vegetables | 8 | Tomatoes, Onions, Cabbage, Carrots, Spinach, Green Peppers, Broccoli, Lettuce |
| Cereals | 7 | Maize, Wheat, Rice, Sorghum, Millet, Finger Millet, Barley |
| Fruits | 8 | Bananas, Mangoes, Oranges, Avocados, Watermelon, Pineapples, Papayas, Passion Fruit |
| Pulses | 7 | Beans, Lentils, Chickpeas, Peas, Pigeon Peas, Cowpeas, Soya Beans |
| Dairy Products | 4 | Fresh Milk, Yogurt, Cheese, Butter |
| Tubers | 5 | Potatoes, Sweet Potatoes, Cassava, Yams, Arrowroot |

**Sample Output:**

```
✅ Seeded 39 products across 6 categories
  📦 Vegetables (8): Tomatoes, Onions, Cabbage, ...
  📦 Cereals (7): Maize, Wheat, Rice, ...
  📦 Fruits (8): Bananas, Mangoes, Oranges, ...
```

---

### 4. **seedPrices.js** - Market Prices

**Purpose:** Creates relational price entries with realistic market variations

**Data Generated:**

- 273 price entries (39 products × 7 markets)
- Faker-generated prices with realistic ranges by category
- Market-specific variations (coastal vs. rural)
- Random dates from last 30 days

**Relational Role:**

- Links products to markets
- References both Product and Market IDs
- Must run **fourth** (last)

**Key Faker Usage:**

```javascript
// Realistic base prices by category
basePrice = faker.number.int({ min: 40, max: 150 }); // Vegetables

// Market variation using Faker
variation = faker.number.float({ min: -0.15, max: 0.15 }); // ±15%

// Recent dates using Faker
date: faker.date.recent({ days: 30 });
```

**Price Generation Logic:**

1. **Base Prices by Category:**

   - Vegetables: 40-150 KES/kg
   - Cereals (bags): 3000-5000 KES/90kg bag
   - Cereals (bulk): 30-80 KES/kg
   - Fruits: 60-200 KES/kg
   - Pulses: 80-200 KES/kg
   - Dairy: 100-250 KES/unit
   - Tubers: 30-120 KES/kg

2. **Regional Market Variations:**

   - **Mombasa (Coastal):** +8% markup + random variation
   - **Kisumu/Kajiado (Rural):** -8% discount + random variation
   - **Others (Urban):** Base price + random variation
   - Random variation: ±15% per entry

3. **Realistic Example:**

   ```
   Product: Tomatoes
   Base Price: 100 KES/kg

   Nairobi: 100 × (1 + 0.02 variation) = ~102 KES/kg
   Mombasa: 100 × (1.08 + 0.05 variation) = ~113 KES/kg
   Kisumu: 100 × (0.92 - 0.08 variation) = ~84 KES/kg
   ```

**Sample Output:**

```
✅ Seeded 273 market price entries

📊 Sample prices (randomized from seeded data):
  Tomatoes (Nairobi): KES 142
  Tomatoes (Kiambu): KES 89
  Tomatoes (Mombasa): KES 118
  Tomatoes (Kisumu): KES 114
```

---

## Running the Seeders

### Option 1: Run All Seeders (Recommended)

```bash
cd backend
npm run seed:all
```

This runs in order:

1. seedCategories.js
2. seedMarkets.js
3. seedProducts.js
4. seedPrices.js

### Option 2: Run Individual Seeders

```bash
# Run each seeder separately
npm run seed:categories
npm run seed:markets
npm run seed:products
npm run seed:prices
```

### Option 3: Run Custom Order

```bash
# Run seeders in any order as long as dependencies are met
node seedCategories.js
node seedMarkets.js
node seedProducts.js
node seedPrices.js
```

---

## Seeder Dependencies

```
seedCategories.js (no dependencies)
         ↓
seedMarkets.js (no dependencies, but before seedPrices)
         ↓
seedProducts.js (depends on seedCategories for reference)
         ↓
seedPrices.js (depends on seedProducts & seedMarkets)
```

**Critical:** Always run in this order or seedPrices will fail!

---

## Data Relational Integrity

### Product → Category Link

```javascript
// Products reference category type by string
{ name: 'Tomatoes', category_type: 'Vegetables', unit: 'KES/kg' }

// This links to:
{ name: 'Vegetables', type: 'Product', sort_order: 1 }
```

### MarketPrice Relationships

```javascript
{
    product_id: ObjectId("..."), // References Product._id
    market_id: ObjectId("..."),  // References Market._id
    price: 142,                  // Realistic Faker-generated
    date: 2024-11-18T...        // Faker-generated recent date
}
```

### Relational Integrity Checks

- ✅ All product_ids in MarketPrice exist in Product collection
- ✅ All market_ids in MarketPrice exist in Market collection
- ✅ All MarketPrice entries are unique (product + market combo)
- ✅ All prices are realistic for the region and category

---

## Faker Configuration

### Locale (Optional)

The seeder uses Faker's default English locale. To add Kenyan-specific data:

```javascript
// Future enhancement - not currently used
const { faker } = require("@faker-js/faker/locale/en_KE");
```

### Seed Determinism (Optional)

For reproducible data, set a Faker seed:

```javascript
// Add to each seeder for consistent results
faker.seed(12345);
```

Currently, seeders generate new random data each run (no fixed seed).

---

## Troubleshooting

### Issue: "No products found" error

```
❌ No products found. Please run seedProducts.js first
```

**Solution:** Run seeders in correct order:

```bash
npm run seed:all  # or run individually in order
```

### Issue: "No markets found" error

```
❌ No markets found. Please run seedMarkets.js first
```

**Solution:** Run seedMarkets.js before seedPrices.js:

```bash
npm run seed:markets
npm run seed:prices
```

### Issue: Faker deprecation warnings

```
[@faker-js/faker]: faker.phone.number(format) is deprecated since v8.1
```

**Status:** This is a warning, not an error. The code still works correctly. To suppress:

```bash
npm update @faker-js/faker@^9.0.0  # When v9 releases
```

### Issue: Duplicate key error

```
MongoError: E11000 duplicate key error
```

**Solution:** Seeders clear collections before inserting:

```javascript
await Product.deleteMany({}); // Clears before insert
```

---

## Performance Metrics

**Seeding Times (Approximate):**
| Script | Records | Time |
|--------|---------|------|
| seedCategories.js | 6 | <1s |
| seedMarkets.js | 7 | <1s |
| seedProducts.js | 39 | <1s |
| seedPrices.js | 273 | ~2-3s |
| **Total** | **325** | **~5s** |

**Database Size:**

- Categories: ~1 KB
- Markets: ~5 KB
- Products: ~8 KB
- Prices: ~50 KB
- **Total:** ~64 KB (minimal overhead)

---

## Faker Methods Used

| Faker Method           | Script         | Purpose                   |
| ---------------------- | -------------- | ------------------------- |
| `faker.company.name()` | seedMarkets.js | Generate market names     |
| `faker.phone.number()` | seedMarkets.js | Generate contact numbers  |
| `faker.number.int()`   | seedPrices.js  | Generate realistic prices |
| `faker.number.float()` | seedPrices.js  | Generate price variations |
| `faker.date.recent()`  | seedPrices.js  | Generate recent dates     |

---

## Next Steps

1. ✅ **Run seeders** - `npm run seed:all`
2. ✅ **Test API endpoints** - Browse `/api/prices` in app
3. ✅ **Verify data** - Check MongoDB for relational integrity
4. ✅ **Customize data** - Edit seed files to match your needs

---

## Customization Guide

### Add More Products

Edit `seedProducts.js`:

```javascript
const productData = [
  // ... existing products
  { name: "Your Product", category_type: "Category Name", unit: "KES/unit" },
];
```

### Add More Markets

Edit `seedMarkets.js`:

```javascript
const kenyaMarkets = [
  // ... existing markets
  {
    name: "Your Market",
    county: "County Name",
    coordinates: [longitude, latitude],
    contact: faker.phone.number(),
  },
];
```

### Adjust Price Ranges

Edit `seedPrices.js`:

```javascript
case 'Your Category':
    basePrice = faker.number.int({ min: 100, max: 300 }); // Your range
    break;
```

### Make Data Reproducible

Add seed to any seeder:

```javascript
const { faker } = require("@faker-js/faker");
faker.seed(12345); // Same number = same data every run
```

---

## Best Practices

✅ **Always run seeders before starting the app**

```bash
npm run seed:all && npm run dev
```

✅ **Clear old data when resetting**

```bash
# Seeders do this automatically, no manual deletion needed
```

✅ **Keep seed data realistic**

```javascript
// Good: 40-150 KES/kg for vegetables
// Bad: 1000000 KES/kg (unrealistic)
```

✅ **Test API endpoints after seeding**

```bash
curl http://localhost:5000/api/categories
curl http://localhost:5000/api/markets
curl http://localhost:5000/api/prices/product/[ID]
```

---

## Version History

| Version | Date         | Changes                                         |
| ------- | ------------ | ----------------------------------------------- |
| 2.0     | Nov 18, 2025 | Added Faker integration, 39 products, 7 markets |
| 1.0     | Nov 18, 2025 | Initial seeding scripts, 16 products, 4 markets |

---

## Support

For issues with Faker integration:

1. Check **seedPrices.js** for error details
2. Verify `.env` file has `MONGO_URI`
3. Ensure MongoDB is running
4. Check TROUBLESHOOTING.md for more help

---

**🌾 Shambani - Market Intelligence for Farmers**

_Powered by @faker-js/faker for realistic test data_
