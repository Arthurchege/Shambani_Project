# Shambani - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js and npm installed
- MongoDB running locally (or accessible via URI)
- Git (optional)

---

## ⚡ Quick Setup

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/shambani" > .env
echo "JWT_SECRET=dev_secret_key_change_in_production" >> .env
echo "PORT=5000" >> .env

# Seed the database with realistic data
npm run seed:all

# Start the backend server
npm run dev
```

**Backend should now be running on http://localhost:5000**

---

### Step 2: Frontend Setup (2 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Frontend should automatically open on http://localhost:3000**

---

## 🔐 Create a Test Account

1. On the login page, click "Register here"
2. Choose any username and password
3. You'll be registered as a **farmer** role
4. Login with your credentials

---

## 🗺️ Try the Features

### 1. **Market Price Comparison** (Main Feature)

- Click "💰 Market Prices" button
- Choose "Browse by Category" OR "Browse by Market"
- Explore the drill-down navigation
- View price comparisons across markets

### 2. **Farm Records**

- Click "📊 Farm Records"
- View records (farmers can only view)
- _Note: Only 'admin' or 'data_entry' roles can add/delete records_

### 3. **Agro-Dealer Locator**

- Click "📍 Agro-Dealer Locator"
- Explore available dealers in your area

---

## 🧪 Test Admin Features

To test the admin panel or data entry features:

1. **Direct Database Access** (Quick Method):

   ```bash
   # Use MongoDB directly to update a user's role
   # In MongoDB shell:
   db.users.updateOne(
     { username: "your_username" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or Create Another User** for testing different roles (currently limited to UI-based registration which defaults to farmer)

---

## 📊 Data Available for Testing

After running `npm run seed:all`, you'll have:

### 4 Product Categories:

- 🥬 Vegetables (Tomatoes, Onions, Cabbage, Carrots, Spinach)
- 🌾 Cereals (Maize, Wheat, Rice, Sorghum)
- 🍌 Fruits (Bananas, Mangoes, Oranges, Avocados)
- 🫘 Pulses (Beans, Lentils, Chickpeas)

### 4 Markets Across Kenya:

- **Wakulima Market** - Nairobi
- **Nakumatt Supermarket** - Kiambu
- **Mombasa Central Market** - Mombasa
- **Kisumu Trading Centre** - Kisumu

### Price Variations:

- Coastal markets (Mombasa) have ~10% markup
- Rural markets (Kisumu) have ~10% discount
- All prices are realistic for 2024-2025

---

## 🔍 API Testing with cURL

Test the API directly:

```bash
# Get all categories
curl http://localhost:5000/api/categories

# Get products in a category (replace ID)
curl http://localhost:5000/api/products/byCategory/{categoryId}

# Get all markets
curl http://localhost:5000/api/markets

# Get price comparison for a product (replace ID)
curl http://localhost:5000/api/prices/product/{productId}

# Get all products at a market (replace ID)
curl http://localhost:5000/api/prices/market/{marketId}
```

---

## 🛠️ Development Commands

### Backend

```bash
cd backend

npm start        # Start server (production)
npm run dev      # Start with nodemon (development)
npm run seed:all # Seed all data
npm run seed:categories
npm run seed:markets
npm run seed:products
npm run seed:prices
```

### Frontend

```bash
cd frontend

npm start   # Start dev server
npm build   # Build for production
npm test    # Run tests
```

---

## 🐛 Common Issues

| Issue                         | Solution                           |
| ----------------------------- | ---------------------------------- |
| **Port 5000 already in use**  | Change PORT in .env file           |
| **MongoDB connection failed** | Install & start MongoDB locally    |
| **Blank prices page**         | Run `npm run seed:all` again       |
| **Can't login**               | Clear browser cache and try again  |
| **CORS errors**               | Ensure backend is running on :5000 |

---

## 📱 Features Overview

### ✅ What's Implemented

- [x] JWT Authentication with role-based token
- [x] User registration and login
- [x] Role-based access control (RBAC)
- [x] Dynamic pricing drill-down navigation
- [x] Price comparison tables
- [x] Market and product browsing
- [x] Farm records CRUD (with role restrictions)
- [x] Responsive UI design
- [x] Complete API endpoints
- [x] Realistic test data

### 🎯 How It Works

**Navigation Flow:**

```
Home Page
    ├── Market Prices
    │   ├── Browse by Category
    │   │   └── Select Product
    │   │       └── View Price Comparison
    │   └── Browse by Market
    │       └── View All Products at Market
    ├── Farm Records (Role-restricted)
    └── Agro-Dealer Locator
```

---

## 📚 Next Steps

1. **Explore the code** - Check out `backend/routes/` and `frontend/src/pages/`
2. **Read SETUP_GUIDE.md** - For comprehensive documentation
3. **Customize data** - Modify seed scripts for your market data
4. **Deploy** - Use Vercel (frontend) and Heroku/Railway (backend)

---

## 💬 Questions?

Refer to:

- `SETUP_GUIDE.md` - Full technical documentation
- Code comments - Inline explanations in every file
- Troubleshooting section - Common issues and solutions

---

**Happy farming! 🌾**

Created: November 2025 | Status: Production Ready
