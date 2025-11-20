// frontend/src/pages/InputLocatorPage.jsx - FINAL CORRECTED VERSION

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const InputLocatorPage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchCounty, setSearchCounty] = useState(user?.location || 'Kiambu'); // Default to user's location

    // CRITICAL: Redirect unauthenticated users and fetch data
    useEffect(() => {
        if (!token) {
            // Redirect unauthenticated users
            navigate('/login');
            return; 
        }

        const fetchDealers = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch is sent to the protected route with the JWT token
                const res = await fetch(`http://localhost:5000/api/dealers/search?county=${searchCounty}`, {
                    headers: {
                        'x-auth-token': token // Sending the JWT token
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setDealers(data);
                } else {
                    setError(data.msg || 'Failed to fetch dealers. Token might be invalid.');
                }
            } catch (err) {
                setError('Network error fetching dealer data. Check backend.');
            }
            setLoading(false);
        };

        // Only fetch if token is present and we have a county to search
        if (token && searchCounty) {
            fetchDealers();
        }

    }, [token, searchCounty, navigate]); // Depend on token, county, and navigate

    // --- Conditional Rendering (MUST be before the final return) ---
    if (!token) return <div className="shambani-container">Redirecting to login...</div>; 
    if (loading) return <div className="shambani-container" style={{textAlign: 'center', marginTop: '50px'}}>Loading agro-dealers...</div>;
    // ----------------------------------------------------------------

    return (
        <div className="input-locator-container" style={{maxWidth: '800px', margin: '0 auto', padding: '20px', paddingTop: '80px', fontFamily: 'Arial, sans-serif'}}>
            <Sidebar />
            <header style={{textAlign: 'center', paddingBottom: '20px', borderBottom: '2px solid #ddd', marginBottom: '25px'}}>
                <h2>📍 Agro-Dealer Locator</h2>
                <p>Find inputs, seeds, and fertilizer near **{searchCounty}**.</p>
            </header>

            {/* County Search/Filter Input */}
            <input 
                type="text" 
                placeholder="Search County (e.g., Kiambu, Nakuru)" 
                value={searchCounty}
                onChange={(e) => setSearchCounty(e.target.value)}
                className="search-input"
                style={{width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '20px'}}
            />

            {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            <div className="dealer-list">
                {dealers.length > 0 ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                        {dealers.map(dealer => (
                            <div key={dealer._id} className="dealer-card" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff'}}>
                                <h3>{dealer.name}</h3>
                                <p><strong>County:</strong> {dealer.county}</p>
                                <p><strong>Contact:</strong> {dealer.contact}</p>
                                <p><strong>Inventory:</strong> {dealer.inventory.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p style={{textAlign: 'center', marginTop: '20px'}}>No dealers found in {searchCounty}.</p>
                )}
            </div>
        </div>
    );
};

export default InputLocatorPage;