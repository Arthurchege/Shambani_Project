// frontend/src/index.js - FINALIZED with Authentication Gate

import React, { useContext } from 'react'; // Added useContext
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate

// Import Components
import App from './App'; // Market Trends (Public)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InputLocatorPage from './pages/InputLocatorPage'; 
import FarmRecordsPage from './pages/FarmRecordsPage';
import PricesPage from './pages/PricesPage';
import ProductsPage from './pages/ProductsPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import MarketProductsPage from './pages/MarketProductsPage'; 

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext'; // Ensure useAuth is imported

// -------------------------------------------------------------
// NEW Component: Wrapper to protect routes (Authentication Gate)
// -------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useAuth();
    
    if (isLoading) {
        // Optional: Show a loading screen while checking local storage
        return <div style={{textAlign: 'center', paddingTop: '50px'}}>Checking authentication...</div>;
    }
    
    // If NO token is found, redirect user to the Login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // If a token IS found, render the child component (the desired page)
    return children;
};
// -------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <Routes>
                    {/* AUTH ROUTES (These MUST remain public) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* PROTECTED ROUTES (Requires wrapping with the Gate) */}
                    
                    {/* 1. Main Root Path: Redirects to Market Prices (landing page) */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <PricesPage />
                        </ProtectedRoute>
                    } /> 
                    
                    {/* 2. Home Page (Market Trends) */}
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    } />
                    
                    {/* 3. Protected Features */}
                    <Route path="/dealers" element={
                        <ProtectedRoute>
                            <InputLocatorPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/records" element={
                        <ProtectedRoute>
                            <FarmRecordsPage />
                        </ProtectedRoute>
                    } />

                    {/* 4. Dynamic Pricing Navigation Routes */}
                    <Route path="/prices" element={
                        <ProtectedRoute>
                            <PricesPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/prices/category/:categoryId" element={
                        <ProtectedRoute>
                            <ProductsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/prices/compare/:productId" element={
                        <ProtectedRoute>
                            <PriceComparisonPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/prices/market/:marketId" element={
                        <ProtectedRoute>
                            <MarketProductsPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Optional: Add a 404 Not Found route */}
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);