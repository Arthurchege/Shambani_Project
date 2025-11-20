// frontend/src/components/Sidebar.jsx
// Hamburger menu navigation component

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="sidebar-container">
      {/* Hamburger Button */}
      <button 
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-icon ${isOpen ? 'open' : ''}`}>☰</span>
      </button>

      {/* Sidebar Menu */}
      <nav className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Shambani Menu</h3>
          <button 
            className="close-button"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="menu-items">
          <li>
            <button 
              className="menu-item"
              onClick={() => handleNavigation('/')}
            >
              💰 Market Prices
            </button>
          </li>
          <li>
            <button 
              className="menu-item"
              onClick={() => handleNavigation('/home')}
            >
              📈 Trends
            </button>
          </li>
          <li>
            <button 
              className="menu-item"
              onClick={() => handleNavigation('/records')}
            >
              📊 Farm Records
            </button>
          </li>
          <li>
            <button 
              className="menu-item"
              onClick={() => handleNavigation('/dealers')}
            >
              📍 Agro-Dealer Locator
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p className="user-info">👤 {user?.email || 'Guest'}</p>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Overlay (closes menu when clicked) */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}

export default Sidebar;
