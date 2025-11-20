# Shambani Application - Complete Setup & Deployment Guide

## Overview

The Shambani application is a MERN stack platform designed to provide detailed, multi-tiered agricultural market intelligence for smallholder Kenyan farmers. This guide covers the complete implementation of the new dynamic drill-down navigation and comparison tool.

---

## Technology Stack

- **Frontend:** React 18.2.0, React Router DOM 7.9.5, Recharts 2.12.7
- **Backend:** Node.js, Express.js 4.19.2
- **Database:** MongoDB 8.3.2 (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.3
- **Utilities:** CORS 2.8.5, dotenv 16.4.5
- **Dev Tools:** Nodemon 3.1.0

---

## New Backend Data Models

### 1. **Category Model** (`backend/models/Category.js`)

```javascript
{
  name: String (unique),
  type: String (enum: 'Product', 'Market'),
  sort_order: Number
}
```

### 2. **Market Model** (`backend/models/Market.js`)

```javascript
{
  name: String,
  county: String,
  contact: String,
  location: {
    type: 'Point' (GeoJSON),
    coordinates: [longitude, latitude]
  }
}
// 2dsphere index automatically created
```

### 3. **Product Model** (`backend/models/Product.js`)

```javascript
{
  name: String,
  category_type: String,
  unit: String (e.g., 'KES/kg', 'KES/90kg Bag')
}
```

### 4. **MarketPrice Model** (`backend/models/MarketPrice.js`)

```javascript
{
  product_id: ObjectId (ref: 'Product'),
  market_id: ObjectId (ref: 'Market'),
  price: Number,
  date: Date
}
```

---

## New Backend API Endpoints

### Categories

- **GET `/api/categories`**
  - Returns all product categories
  - Response: `[{ _id, name, type, sort_order }, ...]`

### Products

- **GET `/api/products/byCategory/:categoryId`**
  - Returns all products in a specific category
  - Response: `[{ _id, name, category_type, unit }, ...]`

### Markets

- **GET `/api/markets`**

  - Returns all markets
  - Response: `[{ _id, name, county, contact, location }, ...]`

- **GET `/api/markets/:marketId`**
  - Returns market details with all products listed there
  - Response: `{ market: {...}, products: [...] }`

### Prices

- **GET `/api/prices/product/:productId`**

  - Returns price comparison table for a single product across all markets
  - Response: `{ product: {...}, priceComparison: [...] }`

- **GET `/api/prices/market/:marketId`**
  - Returns all product prices at a single market
  - Response: `{ market: {...}, prices: [...] }`

---

## Seeder Scripts

### Execution Order (CRITICAL)

```bash
# Step 1: Seed Categories
npm run seed:categories

# Step 2: Seed Markets
npm run seed:markets

# Step 3: Seed Products
npm run seed:products

# Step 4: Seed Prices (requires products & markets)
npm run seed:prices

# OR run all at once
npm run seed:all
```

### Data Generated

- **4 Product Categories:** Vegetables, Cereals, Fruits, Pulses
- **4 Markets:** Across Nairobi, Kiambu, Mombasa, and Kisumu counties
- **16 Products:** Multiple items per category
- **64 Price Records:** Dynamic pricing with market variations

---

## Frontend Routes & Navigation

### Authentication Routes (Public)

- `/login` - User login page
- `/register` - User registration page

### Protected Routes (Require Authentication)

- `/` - Main home page (Market Trends)
- `/dealers` - Agro-dealer locator
- `/records` - Farm records management

### New Pricing Routes (Protected)

- `/prices` - Main pricing hub with tab navigation
  - Browse by Product Category OR
  - Browse by Market Location
- `/prices/category/:categoryId` - Products in a category
- `/prices/compare/:productId` - Price comparison table for a product
- `/prices/market/:marketId` - All products at a specific market

---

## Frontend Components

### New Components Created

1. **ProtectedRoute.jsx**

   - Wraps protected routes
   - Redirects unauthenticated users to login
   - Shows loading state while checking auth

2. **PricesPage.jsx**

   - Tabbed interface for navigation
   - Browse by Category OR Market
   - Level 0 of drill-down navigation

3. **ProductsPage.jsx**

   - Level 1A: Shows all products in a category
   - Click a product to compare prices across markets

4. **PriceComparisonPage.jsx**

   - Level 2: Final comparison table
   - Shows price at each market
   - Displays lowest, average, and highest prices
   - Indicates best deal and percentage differences

5. **MarketProductsPage.jsx**
   - Level 1B: Shows all products at a specific market
   - Displays product prices at that market

---

## Role-Based Access Control (RBAC)

### User Roles

- **farmer** (default)

  - Can view all market data and prices
  - Cannot submit or delete farm records
  - Cannot modify product/market data

- **data_entry**

  - Can submit farm records
  - Can delete farm records
  - Can view all data

- **admin**
  - All permissions
  - Can manage users and data

### Implementation in Frontend

In `FarmRecordsPage.jsx`:

```javascript
const allowedToSubmit = user?.role === "admin" || user?.role === "data_entry";

// Conditionally render form and delete buttons
{
  allowedToSubmit ? <form>...</form> : <div></div>;
}
```

---

## Setup Instructions

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Create `.env` file

```
MONGO_URI=mongodb://localhost:27017/shambani
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

#### 3. Seed Database

```bash
# Option A: Run all seeders in sequence
npm run seed:all

# Option B: Run individually with proper order
npm run seed:categories
npm run seed:markets
npm run seed:products
npm run seed:prices
```

#### 4. Start Backend Server

```bash
npm run dev
# Server will run on http://localhost:5000
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Start Development Server

```bash
npm start
# Application will open at http://localhost:3000
```

---

## User Journey Example

### 1. **Unauthenticated User**

- Visits `http://localhost:3000/`
- Redirected to `/login`
- Can login or register

### 2. **Authenticated User**

- Lands on home page (Market Trends)
- Sees navigation bar with 3 buttons:
  - 💰 Market Prices
  - 📊 Farm Records
  - 📍 Agro-Dealer Locator

### 3. **Browse Prices by Category**

- Clicks "💰 Market Prices"
- Lands on `/prices` (tabbed interface)
- Selects "Browse by Category" tab
- Clicks "Vegetables" category button
- Lands on `/prices/category/{categoryId}`
- Sees buttons: Tomatoes, Onions, Cabbage, Carrots, Spinach
- Clicks "Tomatoes"
- Lands on `/prices/compare/{productId}`
- Sees comparison table with prices at each market
- Identifies best deal (lowest price)

### 4. **Browse Prices by Market**

- From `/prices`, selects "Browse by Market" tab
- Clicks "Wakulima Market" card
- Lands on `/prices/market/{marketId}`
- Sees table of all products at that market with prices

### 5. **Manage Farm Records** (Admin/Data Entry Only)

- Clicks "📊 Farm Records"
- Lands on `/records`
- If user role is `data_entry` or `admin`:
  - Sees form to add new record
  - Can delete existing records
- If user role is `farmer`:
  - Form is hidden
  - Cannot delete records
  - Can only view their records

---

## Testing Checklist

### Authentication

- [ ] Can register new user
- [ ] User defaults to 'farmer' role
- [ ] Can login with credentials
- [ ] JWT token is stored in localStorage
- [ ] Token includes user role in payload
- [ ] Logout clears token and user data

### Navigation

- [ ] Unauthenticated users redirected to /login
- [ ] Authenticated users can access all protected routes
- [ ] Navigation buttons work correctly
- [ ] Back buttons work correctly

### Pricing Features

- [ ] `/prices` loads categories and markets
- [ ] Category selection shows relevant products
- [ ] Product selection shows price comparison
- [ ] Price comparison displays statistics (min, avg, max)
- [ ] Market selection shows all products at that market
- [ ] All prices display correctly formatted

### Role-Based Access

- [ ] Farmer role: no form, no delete buttons
- [ ] Data entry role: has form and delete buttons
- [ ] Admin role: has form and delete buttons
- [ ] Unauthorized role sees empty space instead of form

### Database

- [ ] Categories created successfully
- [ ] Markets created with correct locations
- [ ] Products assigned to correct categories
- [ ] Prices reference correct products and markets
- [ ] Price variations by market are realistic

---

## Troubleshooting

### Issue: "No token, authorization denied"

- **Solution:** Ensure user is logged in and token is stored in localStorage

### Issue: "Category not found"

- **Solution:** Run `npm run seed:categories` before other seeders

### Issue: Prices not showing

- **Solution:** Ensure seeders ran in correct order: categories → markets → products → prices

### Issue: CORS errors

- **Solution:** Verify backend is running on port 5000 and frontend proxy is configured

### Issue: MongoDB connection failed

- **Solution:** Check MONGO_URI in .env file and ensure MongoDB service is running

---

## Performance Optimizations

1. **Geospatial Queries:** Market locations indexed with 2dsphere for future proximity searches
2. **Data Population:** API endpoints populate related data to minimize N+1 queries
3. **Sorting:** Results pre-sorted for consistent UX
4. **Pagination:** Ready to implement with limit/skip parameters

---

## Future Enhancements

1. **Real-time Price Updates:** WebSocket integration for live price feeds
2. **Geolocation:** Find nearest markets based on user location
3. **Price History:** Track price trends over time with charts
4. **Alerts:** Notify farmers when prices reach target levels
5. **Mobile App:** React Native version for offline access
6. **Admin Dashboard:** Analytics and price management UI
7. **Historical Data Export:** CSV/PDF reports for farmers

---

## Security Considerations

1. **JWT Expiration:** Tokens expire after 1 hour (configurable)
2. **Password Hashing:** bcryptjs with 10 salt rounds
3. **Role-Based Access:** Backend validates user role for protected endpoints
4. **CORS:** Configured to accept requests from frontend only
5. **Environment Variables:** Secret keys not committed to repository

---

## File Structure Summary

```
backend/
├── models/
│   ├── User.js
│   ├── FarmRecord.js
│   ├── MarketTrend.js
│   ├── Category.js (NEW)
│   ├── Market.js (NEW)
│   ├── Product.js (NEW)
│   └── MarketPrice.js (NEW)
├── routes/
│   ├── authRoutes.js
│   ├── dealerRoutes.js
│   ├── recordRoutes.js
│   ├── categoryRoutes.js (NEW)
│   ├── marketRoutes.js (NEW)
│   ├── productRoutes.js (NEW)
│   └── priceRoutes.js (NEW)
├── middleware/
│   ├── auth.js
│   └── roleAuth.js
├── seedCategories.js (NEW)
├── seedMarkets.js (NEW)
├── seedProducts.js (NEW)
├── seedPrices.js (NEW)
├── server.js (UPDATED)
└── package.json (UPDATED)

frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── FarmRecordsPage.jsx
│   │   ├── InputLocatorPage.jsx
│   │   ├── PricesPage.jsx (NEW)
│   │   ├── ProductsPage.jsx (NEW)
│   │   ├── PriceComparisonPage.jsx (NEW)
│   │   └── MarketProductsPage.jsx (NEW)
│   ├── components/
│   │   ├── TrendCard.jsx
│   │   ├── TrendChart.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js (UPDATED)
│   ├── index.js (UPDATED)
│   └── index.css
└── package.json
```

---

## Support & Maintenance

For issues, questions, or feature requests, please refer to the troubleshooting section or consult the inline code comments throughout the application.

Last Updated: November 2025
