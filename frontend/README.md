# Shambani — Frontend

This is the React frontend for Shambani (Market trends & farmer tools).

Key UI notes (recent updates):

- The default landing page after login is **Market Prices** (route `/`).
- The trends page is labeled **Trends** (route `/home`).
- Navigation is via a hamburger menu (top-left) that contains: Market Prices, Trends, Farm Records, Agro-Dealer Locator and Logout.
- Authentication now uses **email + password** for registration and login.

## Quick Start

1. Start the backend (from project root `backend`):

```powershell
cd backend
npm install
npm run dev    # or `npm start` depending on your script
```

2. (Optional) Seed the database (if seed scripts exist):

```powershell
node seed.js
node seedDealers.js
```

3. Start the frontend (from project root `frontend`):

```powershell
cd frontend
npm install
npm start
```

Note: If port `3000` is occupied the dev server will offer another port (e.g. `3001`). The browser open URL shown in the terminal is the one to use.

## Authentication

- Register at `/register` with an **email**, **password**, and county.
- Login at `/login` using **email + password**.
- Successful login stores the JWT in `localStorage` and the user info (email, role, location) used by the UI.

## Navigation & Routes

- `/` — Market Prices (landing)
- `/home` — Trends
- `/records` — Farm Records (protected)
- `/dealers` — Agro-Dealer Locator (protected)
- `/login` — Login page
- `/register` — Registration page

## UX details

- The hamburger menu (☰) is top-left; it opens a slide-out menu and includes a Logout button. The top-right logout button on the Trends page was removed to avoid duplication.
- The Sidebar displays the logged-in user's email.

## Testing the flow

1. Run backend and frontend.
2. Visit `/register` and create an account with an email.
3. After register/login you should land on Market Prices (`/`).
4. Open the hamburger menu, confirm you see the Logout button.
5. Click Logout in the sidebar — you should be redirected to `/login` and JWT removed from `localStorage`.

## Contributing

Keep changes focused and small. Frontend code lives under `frontend/src` and backend code under `backend/`.

If you'd like, I can add a short changelog entry and make a commit for the recent auth/navigation updates.
