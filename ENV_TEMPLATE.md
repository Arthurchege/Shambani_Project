# Environment Template

## Backend .env File

```bash
# backend/.env

# MongoDB Connection URI
# Local development
MONGO_URI=mongodb://localhost:27017/shambani

# Or MongoDB Atlas (for production)
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shambani?retryWrites=true&w=majority

# JWT Secret Key - Change this in production!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## Frontend .env File

```bash
# frontend/.env

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

---

## Production Configuration

### Backend .env (Production)

```bash
# MongoDB Atlas URI (replace with your actual credentials)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shambani?retryWrites=true&w=majority

# Strong JWT Secret (generate a secure random string)
JWT_SECRET=<generate-secure-random-secret-32-chars-min>

# Production Port
PORT=5000

# Production Environment
NODE_ENV=production
```

### Frontend .env (Production)

```bash
# Production Backend URL
REACT_APP_API_URL=https://your-backend-domain.com
```

---

## Security Notes

### JWT Secret Generation

Generate a secure JWT secret:

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user with strong password
4. Get connection string
5. Add your IP to whitelist
6. Update MONGO_URI in .env

### Backend Deployment (Heroku/Railway)

1. Push code to GitHub
2. Connect repository to Heroku/Railway
3. Set environment variables in dashboard:
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables:
   - REACT_APP_API_URL=your-backend-url
4. Deploy

---

## Local Development Quick Setup

### Terminal 1: Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/shambani
JWT_SECRET=dev_secret_change_in_production
PORT=5000
NODE_ENV=development
EOF

npm install
npm run seed:all
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend

cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF

npm install
npm start
```

---

## Verifying Setup

### Backend Health Check

```bash
# Should return "Shambani API is running!"
curl http://localhost:5000/

# Should return categories array
curl http://localhost:5000/api/categories
```

### Frontend Verification

- Open http://localhost:3000
- Should see login page
- Should be able to register and login
- After login, should access all pages

---

**💾 Remember: Never commit .env files to version control!**
