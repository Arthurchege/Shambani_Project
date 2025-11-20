// frontend/src/pages/LoginPage.jsx - FINAL COMPLETE VERSION

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Login SUCCESS: data now contains { token, email, location, role }
                
                // CRITICAL FIX: Ensure the role is explicitly included in the object passed to login
                const userData = { 
                    email: data.email, 
                    location: data.location,
                    role: data.role // <-- THIS LINE IS THE SOLUTION
                };
                
                login(data.token, userData); 

                // Navigate away immediately to the market prices landing page
                navigate('/'); 
            } else {
                // Login FAILURE
                setError(data.msg || 'Login failed. Invalid email or password.');
            }
        } catch (err) {
            // Network FAILURE
            console.error('Login Network Error:', err);
            setError('Could not connect to the server. Please ensure the backend is running.');
        }
    };

    return (
        <div className="shambani-container" style={{maxWidth: '420px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <header style={{textAlign: 'center', paddingBottom: '20px', marginBottom: '20px'}}>
                <h2>Farmer Login</h2>
                <p>Access your personalized farm management tools.</p>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px'}}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px'}}/>
                
                <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>Login</button>
            </form>

            {error && <p className="error-message" style={{color: 'red', textAlign: 'center', marginTop: '15px'}}>{error}</p>}
            
            <p style={{textAlign: 'center', marginTop: '20px'}}>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default LoginPage;