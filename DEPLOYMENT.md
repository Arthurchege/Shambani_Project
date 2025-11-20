# Deployment Guide: Shambani App

This guide covers deploying the Shambani application using:

- **Backend**: Railway.app (Node.js + Express)
- **Frontend**: Vercel (React)
- **Database**: MongoDB Atlas (cloud MongoDB)

## Prerequisites

Before starting, ensure you have:

- GitHub account (code pushed to a GitHub repository)
- Vercel account (sign up via GitHub at https://vercel.com)
- Railway account (sign up via GitHub at https://railway.app)
- MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)

---

## Step 1: MongoDB Atlas Setup (Database)

### 1.1 Create a Free MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create a new account
3. Click **Create** → **Build a cluster**
4. Select **M0 Sandbox** (free tier)
5. Choose your region (closest to your users)
6. Click **Create** (takes ~2-3 minutes)

### 1.2 Create a Database User

1. In the Atlas dashboard, navigate to **Database Access**
2. Click **Add New Database User**
3. Enter username: `shambani-user`
4. Generate a secure password (save it somewhere safe)
5. Click **Add User**

### 1.3 Allow Network Access

1. Navigate to **Network Access** in the left menu
2. Click **Add IP Address**
3. Select **Allow access from anywhere** (for simplicity; restrict later in production)
4. Click **Confirm**

### 1.4 Get Connection String

1. Go back to **Clusters** → Click **Connect** on your cluster
2. Select **Connect your application**
3. Copy the connection string (looks like: `mongodb+srv://shambani-user:<password>@cluster0.xxxxx.mongodb.net/shambani?retryWrites=true&w=majority`)
4. **Replace `<password>` with your database user password**
5. **Replace `shambani` database name** if you prefer a different name
6. Save this connection string for the next step

---

## Step 2: Deploy Backend to Railway

### 2.1 Prepare Your Repository

Ensure your GitHub repository is up to date with the latest code:

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

The `Procfile` is already in place (`backend/Procfile` contains: `web: npm start`).

### 2.2 Create Railway Project

1. Go to https://railway.app
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Authorize Railway to access your GitHub
5. Select the repository containing your Shambani code

### 2.3 Configure Environment Variables

In the Railway dashboard for your project:

1. Click the **Backend** service (or create one if it auto-created)
2. Go to the **Variables** tab
3. Add the following environment variables:

```
MONGO_URI=mongodb+srv://shambani-user:<your-password>@cluster0.xxxxx.mongodb.net/shambani?retryWrites=true&w=majority
JWT_SECRET=<generate-a-random-strong-secret-here>
NODE_ENV=production
```

**Example JWT_SECRET** (generate a random one):

```
your_random_secret_key_at_least_32_characters_long_12345
```

### 2.4 Deploy Backend

1. Railway automatically detects the `Procfile`
2. Click **Deploy** → The backend deploys automatically
3. Once deployed, go to the **Settings** tab
4. Find the **Railway Domain** (looks like: `https://yourdomain.up.railway.app`)
5. Save this URL—you'll need it for the frontend configuration

### 2.5 Seed Production Database (Optional but Recommended)

To populate your production database with initial data:

1. In Railway, click the **Backend** service
2. Go to the **Shell** tab
3. Run:
   ```
   npm run seed:all
   ```
4. Wait for completion (you'll see output like "✅ 6 categories seeded", etc.)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Configure Frontend Environment

Create a file `frontend/.env.production` (or configure in Vercel):

```
REACT_APP_API_URL=https://yourdomain.up.railway.app
```

Replace `yourdomain.up.railway.app` with your actual Railway domain from Step 2.4.

### 3.2 Create Vercel Project

1. Go to https://vercel.com
2. Click **New Project**
3. Select **Import Git Repository**
4. Authorize Vercel to access your GitHub
5. Select your Shambani repository
6. In the configuration:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### 3.3 Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://yourdomain.up.railway.app` (your Railway domain)
3. Click **Add**

### 3.4 Deploy Frontend

1. Click **Deploy**
2. Vercel automatically builds and deploys your React app
3. Once deployed, you'll get a Vercel URL (looks like: `https://shambani.vercel.app`)
4. This is your live application URL!

---

## Step 4: Verify Deployment

### 4.1 Test Backend API

In your browser or REST client (Postman):

1. Get all market prices:

   ```
   GET https://yourdomain.up.railway.app/api/prices
   ```

   Expected: JSON array of market prices

2. Register a new user:
   ```
   POST https://yourdomain.up.railway.app/api/auth/register
   Body: {"email": "test@example.com", "password": "TestPass123!"}
   ```
   Expected: JWT token response

### 4.2 Test Frontend

1. Open your Vercel URL in a browser (e.g., `https://shambani.vercel.app`)
2. You should see the Market Prices page as the landing page
3. Try to **Register** with an email and password
4. After login, navigate to **Prices** page
5. Verify the connection status shows **🟢 Live** (green indicator)
6. Try creating a new price—it should appear live with a "Live Update" notification

### 4.3 Test Real-Time Socket Connection

1. Open the app in multiple browser tabs simultaneously
2. Create a new market price in one tab
3. The other tabs should immediately show the new price (without refresh) with a "Live Update" banner
4. This confirms Socket.IO is working in production

---

## Step 5: Custom Domain (Optional)

### 5.1 For Vercel

1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Update DNS records according to Vercel's instructions

### 5.2 For Railway Backend

1. In Railway project settings → **Domain**
2. Add your custom domain
3. Update DNS records

---

## Troubleshooting

### Frontend shows "API connection error"

- Check that `REACT_APP_API_URL` is set correctly in Vercel environment variables
- Verify the Railway domain is accessible: `curl https://yourdomain.up.railway.app/api/prices`
- Check browser console (F12) for CORS errors

### Socket.IO connection shows 🔴 Offline

- Ensure the backend is running on Railway (check Railway logs)
- Verify `REACT_APP_API_URL` points to the correct Railway domain
- Check browser console for WebSocket errors
- Try a hard refresh (Ctrl+Shift+R)

### Database connection fails

- Verify `MONGO_URI` is correct in Railway environment variables
- Check MongoDB Atlas network access includes Railway's IP range (use "Allow from anywhere" for testing)
- Ensure database user password doesn't contain special characters that need URL encoding

### Seed command fails on Railway

1. Go to Railway → Backend service → **Shell** tab
2. Run: `npm install` (to ensure all dependencies are installed)
3. Then run: `npm run seed:all`
4. Check output for specific errors

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created and verified
- [ ] Backend deployed to Railway with all env vars set
- [ ] Frontend deployed to Vercel with `REACT_APP_API_URL` configured
- [ ] API endpoints respond correctly
- [ ] User registration and login work
- [ ] Real-time socket connection shows 🟢 Live
- [ ] Test creating a price—others see it live without refresh
- [ ] Seed data visible in frontend (273 market prices)

---

## Scaling & Optimization (Optional Future Steps)

- **Database**: Upgrade MongoDB Atlas tier if hitting query limits
- **Backend**: Enable Railway auto-scaling for high traffic
- **Frontend**: Vercel handles scaling automatically
- **Security**: Add SSL certificate (automatically done by Vercel & Railway)
- **Monitoring**: Set up error tracking (Sentry recommended)

---

## Need Help?

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com
