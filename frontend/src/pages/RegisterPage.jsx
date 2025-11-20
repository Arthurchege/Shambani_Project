// frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to potentially log user in immediately

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('Kiambu'); // Default to a relevant county
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // If we choose to log them in immediately

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // 1. Send registration data to the Express backend
            const res = await fetch('/api/auth/register', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, location })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Registration successful!');
                
                // OPTION 1 (Best Practice): Redirect to login page
                // navigate('/login'); 

                // OPTION 2 (For quick testing): Log the user in immediately
                login(data.token, { email: data.email, location: data.location });
                
                setTimeout(() => {
                    navigate('/'); // Send them to the market prices landing page
                }, 1000);
                
            } else {
                setError(data.msg || 'Registration failed. Try a different email.');
            }
        } catch (err) {
            setError('Network error. Ensure the backend is running and reachable.');
        }
    };

    return (
        <div className="shambani-container" style={{maxWidth: '420px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <header style={{textAlign: 'center', paddingBottom: '20px', marginBottom: '20px'}}>
                <h2>Farmer Registration</h2>
                <p>Sign up to access personalized dealer and farm input information.</p>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
                <div style={{marginBottom: '15px'}}>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}/>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}/>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <input type="text" placeholder="Your County (e.g., Kiambu)" value={location} onChange={(e) => setLocation(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}/>
                </div>
                
                <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Register</button>
            </form>

            {success && <p style={{color: 'green', textAlign: 'center', marginTop: '15px'}}>{success}</p>}
            {error && <p style={{color: 'red', textAlign: 'center', marginTop: '15px'}}>{error}</p>}
            
            <p style={{textAlign: 'center', marginTop: '20px'}}>Already registered? <a href="/login">Log in here</a></p>
        </div>
    );
};

export default RegisterPage;