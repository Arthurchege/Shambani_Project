// frontend/src/pages/PricesPage.jsx

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const PricesPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('category'); // 'category' or 'market'
    const [categories, setCategories] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingMarkets, setLoadingMarkets] = useState(false);
    const [error, setError] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);

    // Fetch functions
    const fetchCategories = async () => {
        setLoadingCategories(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/categories');
            if (res.ok) {
                const data = await res.json();
                const productCategories = data.filter(cat => cat.type === 'Product');
                setCategories(productCategories);
            } else {
                setError('Failed to load categories');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'category') fetchCategories();
    }, [activeTab]);

    const fetchMarkets = async () => {
        setLoadingMarkets(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/markets');
            if (res.ok) {
                const data = await res.json();
                setMarkets(data);
            } else {
                setError('Failed to load markets');
            }
        } catch (err) {
            console.error('Error fetching markets:', err);
            setError('Failed to load markets');
        } finally {
            setLoadingMarkets(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'market') fetchMarkets();
    }, [activeTab]);

    // Real-time socket: listen for price updates and append to the visible list
    const [latestUpdate, setLatestUpdate] = useState(null);

    const { token } = useAuth();

    useEffect(() => {
        // Connect to socket (authenticated or unauthenticated)
        // Pass token if available, but allow connection without it
        const socketOptions = {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        };

        if (token) {
            socketOptions.auth = { token };
        }

        const socket = io('http://localhost:5000', socketOptions);

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        socket.on('priceUpdate', (payload) => {
            console.log('Received priceUpdate:', payload);
            // payload is the created MarketPrice (populated)
            setLatestUpdate(payload);

            // Refresh the currently visible list so users see new data
            if (activeTab === 'market') {
                fetchMarkets();
            } else if (activeTab === 'category') {
                fetchCategories();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setSocketConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('priceUpdate');
            socket.off('connect_error');
            socket.disconnect();
        };
    }, [token, activeTab]);

    const handleCategoryClick = (categoryId) => {
        navigate(`/prices/category/${categoryId}`);
    };

    const handleMarketClick = (marketId) => {
        navigate(`/prices/market/${marketId}`);
    };

    return (
        <div className="shambani-container" style={{ maxWidth: '900px' }}>
            <Sidebar />
            
            <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
                <h2>💰 Market Price Comparison</h2>
                <p>Browse agricultural prices by product category or market location</p>
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}

            {/* Connection Status Indicator */}
            <div style={{ textAlign: 'right', marginBottom: '15px', fontSize: '0.9em' }}>
                <span style={{ color: socketConnected ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                    {socketConnected ? '🟢 Live' : '🔴 Offline'}
                </span>
            </div>

            {/* Live update notice */}
            {latestUpdate && (
                <div style={{ background: '#fff6e6', border: '1px solid #ffd27a', padding: '10px 14px', borderRadius: 6, margin: '0 auto 18px', maxWidth: 860, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#7a4b00' }}>
                        🔔 New price: <strong style={{ color: '#38761D' }}>{latestUpdate.product?.name || latestUpdate.product}</strong> in <strong>{latestUpdate.market?.name || latestUpdate.market}</strong> — KSh {latestUpdate.price}
                    </div>
                    <div>
                        <button onClick={() => setLatestUpdate(null)} style={{ background: '#38761D', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>Dismiss</button>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #38761D' }}>
                <button
                    onClick={() => setActiveTab('category')}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: activeTab === 'category' ? '#38761D' : 'transparent',
                        color: activeTab === 'category' ? 'white' : '#38761D',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1em'
                    }}>
                    📦 Browse by Category
                </button>
                <button
                    onClick={() => setActiveTab('market')}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: activeTab === 'market' ? '#38761D' : 'transparent',
                        color: activeTab === 'market' ? 'white' : '#38761D',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1em'
                    }}>
                    📍 Browse by Market
                </button>
            </div>

            {/* Category View */}
            {activeTab === 'category' && (
                <div>
                    <h3 style={{ color: '#38761D' }}>Select a Product Category</h3>
                    {loadingCategories && <p>Loading categories...</p>}
                    {!loadingCategories && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {categories.map(category => (
                                <button
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category._id)}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: '#f5f5f5',
                                        border: '2px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1.1em',
                                        fontWeight: 'bold',
                                        color: '#38761D',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#e6ffe6';
                                        e.currentTarget.style.borderColor = '#38761D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        e.currentTarget.style.borderColor = '#ddd';
                                    }}>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Market View */}
            {activeTab === 'market' && (
                <div>
                    <h3 style={{ color: '#38761D' }}>Select a Market Location</h3>
                    {loadingMarkets && <p>Loading markets...</p>}
                    {!loadingMarkets && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                            {markets.map(market => (
                                <button
                                    key={market._id}
                                    onClick={() => handleMarketClick(market._id)}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: '#f5f5f5',
                                        border: '2px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#e6ffe6';
                                        e.currentTarget.style.borderColor = '#38761D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        e.currentTarget.style.borderColor = '#ddd';
                                    }}>
                                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#38761D', marginBottom: '5px' }}>
                                        {market.name}
                                    </div>
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                                        📍 {market.county}
                                    </div>
                                    {market.contact && (
                                        <div style={{ fontSize: '0.85em', color: '#999', marginTop: '5px' }}>
                                            📞 {market.contact}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PricesPage;
