# 🚂 Railway Deployment Guide for Shambani

This guide walks you through deploying Shambani to Railway with MongoDB Atlas.

---

## ✅ Current Status

- ✅ GitHub repository connected
- ✅ Backend code pushed to GitHub
- ✅ Railway detected your app
- ❌ **ISSUE**: MongoDB not configured → backend crashes on startup
- ✅ Port correctly set to 8080 on Railway

---

## 📋 Quick Checklist

- [ ] **Step 1**: Create MongoDB Atlas account
- [ ] **Step 2**: Create a database cluster
- [ ] **Step 3**: Get MongoDB connection string
- [ ] **Step 4**: Add environment variables to Railway
- [ ] **Step 5**: Verify backend connects
- [ ] **Step 6**: Deploy frontend to Vercel
- [ ] **Step 7**: Connect frontend to backend URL

---

## Step 1: Create MongoDB Atlas Account

### Why?

MongoDB Atlas is a cloud database. Your Railway backend needs a cloud database to work.

### Instructions

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Sign Up"** (or Sign In if you have an account)
3. Create account with email/password
4. Verify your email
5. Accept terms and create organization
6. You'll be taken to the cluster creation page

---

## Step 2: Create a Database Cluster

1. On the MongoDB Atlas dashboard, click **"Create a Database"**
2. Choose **"M0 Shared"** tier (FREE - perfect for development)
3. Select **region closest to you** (e.g., `us-east-1` if in USA, `eu-west-1` if in Europe)
4. Click **"Create Deployment"**
5. Wait 2-3 minutes for cluster to be created

---

## Step 3: Get MongoDB Connection String

### Create Database User

1. In MongoDB Atlas, go to **Security → Database Access**
2. Click **"Add New Database User"**
3. Fill in:
   - **Username**: `shambani_user` (or any username)
   - **Password**: Generate secure password (save this!)
   - **Built-in Role**: Select `"readWriteAnyDatabase"`
4. Click **"Add User"**

### Get Connection String

1. Go to **Deployment → Databases**
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"** option
4. Copy the connection string that looks like:

```
mongodb+srv://shambani_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. **Replace `<password>` with your actual database user password**

Example final string:

```
mongodb+srv://shambani_user:myPassword123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

---

## Step 4: Add Environment Variables to Railway

1. Go to **Railway.app** → Your Shambani Project
2. Click **"Variables"** tab
3. Add these environment variables:

| Key          | Value                                  | Example                                                                                        |
| ------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `MONGO_URI`  | Your MongoDB connection string         | `mongodb+srv://shambani_user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate a random 32+ character string | `7k9x#mP2$qR8vN4@wL1jB5cD6eF9gH3`                                                              |
| `NODE_ENV`   | `production`                           | `production`                                                                                   |
| `PORT`       | `8080`                                 | `8080`                                                                                         |

### How to Generate JWT_SECRET

Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into Railway's `JWT_SECRET` field.

4. Click **"Save Variables"**
5. Railway will automatically redeploy with new variables ✅

---

## Step 5: Verify Backend Connects

1. Go to Railway dashboard → Your Shambani project
2. Click on **"Logs"** tab
3. Watch the logs as the app starts
4. You should see:
   ```
   ✅ MongoDB connected!
   📡 Server running on port 8080
   ```

If you see this ✅, your backend is working!

If you still see the connection error ❌:

- Double-check `MONGO_URI` is correct
- Make sure password doesn't have special characters (or URL-encode them)
- Verify database user was created in MongoDB Atlas
- Check IP whitelist in MongoDB Atlas (Security → Network Access → Allow all IPs for testing)

---

## Step 6: Deploy Frontend to Vercel

Once backend is working, deploy frontend to Vercel.

### 6A. Connect GitHub to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** with GitHub (or login)
3. Authorize Vercel to access your GitHub
4. Click **"Import Project"**
5. Search for your GitHub repo: `Shambani_Project`
6. Click **"Import"**

### 6B. Configure Environment Variables

1. In Vercel import dialog, find **"Environment Variables"** section
2. Add:

   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your Railway backend URL (format: `https://yourdomain-production.up.railway.app`)
     - Find this URL in Railway dashboard under "Public Domain"
   - **Environment**: Select `Production`

3. Click **"Deploy"**
4. Wait 2-3 minutes for Vercel to build and deploy

---

## Step 7: Connect Frontend to Backend

Once both are deployed:

1. **Get your Railway backend URL**:

   - Railway dashboard → Shambani project → Settings → "Public Domain"
   - Example: `https://shambani-production.up.railway.app`

2. **Get your Vercel frontend URL**:

   - Vercel dashboard → Deployments → Copy URL
   - Example: `https://shambani-frontend.vercel.app`

3. **Test the connection**:
   - Open frontend URL in browser
   - Try to register/login
   - If forms work and redirect works → **✅ Connected!**

---

## 🔧 Troubleshooting

### Backend Shows "Connection Refused" Error

**Problem**: MongoDB connection string is wrong or database user password incorrect

**Solution**:

1. Go to MongoDB Atlas → Database Access
2. Verify username and password match
3. Copy connection string again carefully
4. In Railway variables, update `MONGO_URI`
5. Watch logs to see if it connects

### Frontend Shows "Cannot Connect to Backend"

**Problem**: `REACT_APP_API_URL` environment variable not set

**Solution**:

1. Redeploy frontend to Vercel with correct environment variable
2. Or manually add the variable in Vercel dashboard:
   - Settings → Environment Variables → Add `REACT_APP_API_URL`
   - Value: Your Railway backend URL
   - Trigger redeploy

### "Invalid MongoDB Connection String"

**Problem**: Special characters in password not URL-encoded

**Solution**:
If your password is `myP@ss!word`, you need to URL-encode special characters:

- `@` → `%40`
- `!` → `%21`
- `#` → `%23`
- etc.

So password becomes: `myP%40ss%21word`

Or just regenerate a simpler password in MongoDB Atlas.

### Port 8080 Already in Use

**Not an issue on Railway** - Railway assigns port 8080 automatically. This only matters locally.

---

## 📊 Expected Result

After following all steps:

| Component | Status       | URL                                 |
| --------- | ------------ | ----------------------------------- |
| Backend   | ✅ Running   | `https://yourdomain.up.railway.app` |
| Frontend  | ✅ Running   | `https://yourdomain.vercel.app`     |
| Database  | ✅ Connected | MongoDB Atlas (cloud)               |
| Auth      | ✅ Working   | Login → JWT token stored            |
| Real-time | ✅ Working   | Price updates broadcast live        |

---

## 🎯 Next Steps After Deployment

1. **Test the app**:

   - Register as Farmer
   - Click "Market Prices"
   - Browse categories/markets
   - See live updates work

2. **Optional: Add Custom Domain**:

   - Railway → Settings → Domains → Add custom domain
   - Point your domain DNS to Railway

3. **Optional: Monitor Logs**:

   - Railway → Logs tab - watch for errors in production
   - Vercel → Deployments → Logs - check frontend issues

4. **Optional: Add Sentry Monitoring**:
   - Create Sentry account at https://sentry.io
   - Add Sentry SDK to backend/frontend
   - Get error alerts in real-time

---

## 📞 Need Help?

| Issue                     | Check                                          |
| ------------------------- | ---------------------------------------------- |
| Backend won't start       | Railway Logs tab - look for error messages     |
| Frontend shows blank page | Browser console (F12 → Console tab)            |
| Can't login               | Check MONGO_URI and JWT_SECRET in Railway      |
| Prices not updating       | Check Socket.IO connection in browser DevTools |

---

## ✅ Deployment Complete!

Once everything is deployed:

- Your backend is live on Railway
- Your frontend is live on Vercel
- Your database is live on MongoDB Atlas
- Users can access your app globally! 🎉

---

_Last Updated: November 20, 2025_  
_Shambani - Ready for Production_ 🚀
