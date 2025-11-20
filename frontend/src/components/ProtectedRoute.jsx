// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="shambani-container">Loading authentication...</div>;
    }

    if (!user) {
        // Redirect unauthenticated users to login
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the component
    return children;
};

export default ProtectedRoute;
