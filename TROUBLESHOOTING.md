# Shambani - Troubleshooting Guide

## Common Issues & Solutions

---

## Backend Issues

### MongoDB Connection Failed

**Symptom:**

```
❌ MongoDB Connection Error. Check MONGO_URI in .env
```

**Causes & Solutions:**

1. **MongoDB not running**

   ```bash
   # On Windows
   net start MongoDB

   # On Mac
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongod
   ```

2. **Wrong MONGO_URI**

   - Check `.env` file for correct URI
   - Default local: `mongodb://localhost:27017/shambani`
   - MongoDB Atlas: Check username/password are correct
   - Whitelist your IP in MongoDB Atlas

3. **Network connectivity issue**

   - Ping MongoDB server: `ping localhost`
   - For Atlas, ensure firewall allows port 27017

4. **MongoDB service crashed**
   - Restart MongoDB service
   - Check MongoDB logs for errors

---

### Port 5000 Already in Use

**Symptom:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find process using port 5000**

   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

2. **Change port in .env**

   ```
   PORT=5001
   ```

3. **Update frontend proxy** in `frontend/package.json`:
   ```json
   "proxy": "http://localhost:5001"
   ```

---

### Seeders Not Creating Data

**Symptom:**
Database is empty after running `npm run seed:all`

**Solutions:**

1. **Run seeders in correct order**

   ```bash
   npm run seed:categories
   npm run seed:markets
   npm run seed:products
   npm run seed:prices
   ```

   NOT all at once if it's your first time

2. **Check MongoDB connection**

   ```bash
   # Verify seeders can connect
   node seedCategories.js
   # Should show: ✅ Seeded X categories
   ```

3. **Clear old data first**

   ```bash
   # Using MongoDB shell
   db.categories.deleteMany({})
   db.markets.deleteMany({})
   db.products.deleteMany({})
   db.marketprices.deleteMany({})
   ```

4. **Check file paths**
   - Ensure seed scripts are in `backend/` folder
   - Models imported correctly in seed scripts

---

### Dependencies Not Installed

**Symptom:**

```
Cannot find module 'express'
```

**Solution:**

```bash
cd backend
npm install

# If still issues, try
rm package-lock.json
npm cache clean --force
npm install
```

---

### JWT Secret Not Set

**Symptom:**

```
Error: JWT_SECRET must be defined
```

**Solution:**

1. Create `.env` file in backend folder
2. Add: `JWT_SECRET=your_secret_key`
3. Restart server

---

### CORS Errors

**Symptom:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

1. **Check backend is running**

   ```bash
   curl http://localhost:5000/
   # Should return: Shambani API is running!
   ```

2. **Check frontend proxy** in `frontend/package.json`:

   ```json
   "proxy": "http://localhost:5000"
   ```

3. **For production**, add frontend URL to CORS in `backend/server.js`:
   ```javascript
   const cors = require("cors");
   app.use(
     cors({
       origin: "https://your-frontend-domain.com",
     })
   );
   ```

---

## Frontend Issues

### Port 3000 Already in Use

**Symptom:**

```
Something is already running on port 3000
```

**Solutions:**

1. **Change port**

   ```bash
   PORT=3001 npm start
   ```

2. **Kill process using port**

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -i :3000
   kill -9 <PID>
   ```

---

### Blank Page or "Loading..."

**Symptom:**
Frontend shows loading state indefinitely

**Solutions:**

1. **Check backend is running**

   ```bash
   curl http://localhost:5000/
   ```

2. **Check browser console for errors**

   - Open DevTools (F12)
   - Look at Console tab for red errors

3. **Clear cache**

   ```bash
   # In Chrome: Ctrl+Shift+Delete
   # Or Ctrl+F5 (hard refresh)
   ```

4. **Check network tab** in DevTools
   - See if API requests are failing
   - Check response status codes

---

### Cannot Login

**Symptom:**
Login button doesn't work or shows error

**Solutions:**

1. **Check backend is running**

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   ```

2. **Verify user exists in database**

   - Go to MongoDB
   - Check `users` collection has your account

3. **Check password is correct**

   - Passwords are hashed, so typos will fail
   - Register again if forgotten

4. **Clear localStorage**
   - Open DevTools (F12)
   - Application → Local Storage
   - Clear all data
   - Try login again

---

### Protected Routes Not Working

**Symptom:**
Cannot access `/prices`, `/records`, etc. after login

**Solutions:**

1. **Check user is actually logged in**

   - DevTools → Application → Local Storage
   - Should have `token` and `user` keys

2. **Check token is valid**

   - Logout and login again
   - Token might have expired

3. **Check ProtectedRoute component**

   - In `frontend/src/index.js`
   - Routes should be wrapped with `<ProtectedRoute>`

4. **Verify backend routes exist**
   ```bash
   curl http://localhost:5000/api/categories
   # Should return array of categories
   ```

---

### Prices Page Shows No Data

**Symptom:**
Categories or markets not loading on prices page

**Solutions:**

1. **Run seeders**

   ```bash
   cd backend
   npm run seed:all
   ```

2. **Verify data in database**

   ```bash
   # Using MongoDB shell
   db.categories.find()
   db.markets.find()
   ```

3. **Check API response**

   ```bash
   curl http://localhost:5000/api/categories
   # Should return non-empty array
   ```

4. **Check frontend console** for errors
   - Open DevTools (F12)
   - Look for fetch errors

---

### Delete Buttons Not Showing

**Symptom:**
Farm records page doesn't show delete buttons even though user is admin

**Solutions:**

1. **Check user role in localStorage**

   - DevTools → Application → Local Storage
   - Check if `user` object has correct `role`

2. **Update database directly**

   ```bash
   # In MongoDB shell
   db.users.updateOne(
     { username: "your_username" },
     { $set: { role: "admin" } }
   )
   ```

3. **Logout and login again**

   - New token should include updated role

4. **Check conditional rendering**
   - In `frontend/src/pages/FarmRecordsPage.jsx`
   - `allowedToSubmit` condition might be wrong

---

## Database Issues

### Data Not Persisting

**Symptom:**
Data disappears after restarting server

**Solutions:**

1. **Check MONGO_URI**

   - Local: `mongodb://localhost:27017/shambani`
   - Should point to persistent database

2. **For MongoDB Atlas**

   - Check connection string is correct
   - Verify whitelist includes your IP

3. **For local MongoDB**
   - Ensure database is not clearing on restart
   - Check MongoDB data directory exists

---

### Duplicate Key Error

**Symptom:**

```
E11000 duplicate key error
```

**Solution:**

```bash
# Clear duplicates from database
db.users.deleteMany({ username: "duplicate_username" })

# Or run seeders again
npm run seed:all
```

---

### Database Locked

**Symptom:**

```
Error: Database is locked
```

**Solution:**

1. Stop all Node processes
2. Restart MongoDB service
3. Try again

---

## Performance Issues

### Slow API Response

**Causes:**

1. **Database indexes missing**

   - Market location 2dsphere index should be created automatically
   - Can be added manually:
     ```javascript
     db.markets.createIndex({ location: "2dsphere" });
     ```

2. **Too much data**

   - Consider implementing pagination
   - Use `.limit(10)` in queries

3. **Network issues**
   - Check internet connection
   - Try on different network

---

### High Memory Usage

**Solution:**

```bash
# Restart Node process
npm run dev

# Or limit memory
node --max-old-space-size=2048 server.js
```

---

## Authentication Issues

### Token Expired

**Symptom:**
Login works but getting "Token is not valid" error

**Solution:**

- Tokens expire after 1 hour
- User should login again
- Update token expiration in `backend/routes/authRoutes.js` if needed:
  ```javascript
  {
    expiresIn: "24h";
  } // Change from '1h'
  ```

---

### Role Not in Token

**Symptom:**
Admin features not working even though user is admin

**Solution:**

1. Update user role in database
2. Logout and login again
3. Check token payload includes role:
   ```javascript
   // In backend/routes/authRoutes.js
   const payload = {
     user: {
       id: userId,
       role: role, // Must be here
     },
   };
   ```

---

## Deployment Issues

### MongoDB Atlas Connection Failed

**Symptom:**

```
Error: connect ECONNREFUSED
```

**Solution:**

2. **Check connection string**

   - Get from MongoDB Atlas dashboard
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/database`
   - Never commit actual credentials to version control

2. **Check username/password**

   - No special characters without escaping
   - If password has `@`, use `%40`

3. **Whitelist IP**

   - In MongoDB Atlas: Security → Network Access
   - Add your IP or `0.0.0.0/0` (not recommended for production)

4. **Check firewall**
   - Port 27017 might be blocked
   - Configure AWS/GCP/Azure security groups

---

### Environment Variables Not Loading

**Symptom:**

```
Cannot read properties of undefined
```

**Solution:**

1. **Ensure .env file exists** in backend folder

2. **Check dotenv is loaded** in server.js:

   ```javascript
   const dotenv = require("dotenv");
   dotenv.config(); // Must be before other code
   ```

3. **Verify variables in deployment**
   - Heroku: Dashboard → Config Vars
   - Railway: Settings → Variables
   - Vercel: Project Settings → Environment Variables

---

### Frontend Can't Connect to Backend

**Symptom:**
CORS errors or "Cannot connect to server"

**Solution:**

1. **Update API URL** in frontend `.env`:

   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

2. **Update all fetch calls** if using hardcoded URLs:

   ```javascript
   // Wrong (hardcoded)
   fetch("http://localhost:5000/api/...");

   // Right (use environment variable)
   fetch(`${process.env.REACT_APP_API_URL}/api/...`);
   ```

3. **Enable CORS on backend**:
   ```javascript
   const cors = require("cors");
   app.use(
     cors({
       origin: "https://your-frontend-url.com",
     })
   );
   ```

---

## Getting Help

### Debug Process

1. **Check console for errors**

   - Browser DevTools (F12)
   - Terminal output

2. **Verify connectivity**

   ```bash
   curl http://localhost:5000/
   curl http://localhost:5000/api/categories
   ```

3. **Check database**

   ```bash
   # MongoDB shell
   show dbs
   use shambani
   db.categories.find()
   ```

4. **Check configuration**

   - `.env` file exists and correct
   - Port numbers match frontend proxy
   - All dependencies installed

5. **Read error messages carefully**
   - They usually indicate the problem
   - Google the specific error message

---

### Resources

- **Code Comments** - Every file has explanations
- **SETUP_GUIDE.md** - Comprehensive setup guide
- **API_DOCUMENTATION.md** - API endpoint details
- **Browser DevTools** - Network tab for API errors
- **MongoDB Shell** - Direct database inspection

---

## Creating an Issue Report

When reporting issues, include:

1. **What you tried to do**

   - Step by step actions

2. **What happened**

   - Error message (full text)
   - Screenshot if visual issue

3. **What you expected**

   - What should happen

4. **Environment**

   - OS (Windows/Mac/Linux)
   - Node version: `node --version`
   - npm version: `npm --version`
   - MongoDB version (if local)

5. **Logs**
   - Terminal output
   - Browser console errors
   - Network tab responses

---

**Last Updated: November 18, 2025**

For additional help, refer to documentation files or examine inline code comments.
