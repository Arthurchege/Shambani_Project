// frontend/src/App.jsx - FINALIZED with Navigation Links

import React, { useState, useEffect, useMemo } from 'react';
import TrendCard from './components/TrendCard';
import Sidebar from './components/Sidebar';
import './App.css';
import { useAuth } from './context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

function App() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  
  const [trends, setTrends] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  // --- LOGIC ---
  
  // Data Fetching
  useEffect(() => {
    fetch('/api/trends') 
      .then(res => {
        if (!res.ok) {
          throw new Error('Server returned an error.');
        }
        return res.json();
      })
      .then(data => {
        setTrends(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load market data. Ensure backend is running.');
        setLoading(false);
      });
  }, []); 

  // Filtering Logic
  const filteredTrends = useMemo(() => {
    if (!searchTerm) {
      return trends; 
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return trends.filter(trend => (
      trend.commodity.toLowerCase().includes(lowerCaseSearchTerm) ||
      trend.region.toLowerCase().includes(lowerCaseSearchTerm)
    ));
  }, [trends, searchTerm]); 

  // Authentication Handler
  const handleAuthClick = () => {
    if (user) {
      logout(); 
      navigate('/'); // Stay on the home page after logout
    } else {
      navigate('/login'); 
    }
  };

  // Removed unused handleNavigation function

  return (
    <div className="shambani-container">
      <Sidebar />
      
      <header>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{margin: 0, color: '#38761D'}}>Shambani</h1>
            
            {/* --- Auth Button (Login/Logout) --- */}
            <div>
              {!user ? (
                <button 
                    onClick={handleAuthClick} 
                    style={{
                        padding: '8px 12px', 
                        backgroundColor: '#007BFF', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                    Login / Register
                </button>
              ) : null}
            </div>
        </div>
        
        <p className="sdg-note" style={{marginTop: '5px'}}>Trends</p>
        <small>Aligning with **SDG 2: Zero Hunger**</small>
        <hr style={{borderTop: '2px solid #38761D', margin: '15px 0'}} />
      </header>

      {/* Search Bar Input */}
      <input 
        type="text" 
        placeholder="Search by commodity or region..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input" 
      />
      
      {loading && <p className="loading">Loading market data...</p>}
      {error && <p className="error">{error}</p>}
      
      {/* Display Filtered Results */}
      {!loading && !error && filteredTrends.length === 0 && (
        <p className="no-results">No matching trends found for "{searchTerm}".</p>
      )}

      <div className="trends-list">
        {filteredTrends.map(trend => ( 
          <TrendCard key={trend._id} trend={trend} />
        ))}
      </div>
    </div>
  );
}

export default App;