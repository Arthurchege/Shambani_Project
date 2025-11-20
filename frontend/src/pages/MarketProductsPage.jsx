// frontend/src/pages/MarketProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MarketProductsPage = () => {
    const { marketId } = useParams();
    const navigate = useNavigate();

    const [market, setMarket] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarketDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`http://localhost:5000/api/prices/market/${marketId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMarket(data.market);
                    setProducts(data.prices);
                } else {
                    setError('Failed to load market details');
                }
            } catch (err) {
                console.error('Error fetching market details:', err);
                setError('Failed to load market details');
            } finally {
                setLoading(false);
            }
        };

        fetchMarketDetails();
    }, [marketId]);

    return (
        <div className="shambani-container" style={{ maxWidth: '900px', paddingTop: '80px' }}>
            <Sidebar />
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <button
                    onClick={() => navigate('/prices')}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '15px'
                    }}>
                    ← Back to Prices
                </button>
                <h2>{market?.name || 'Market'}</h2>
                <p style={{ fontSize: '0.95em', color: '#666' }}>
                    📍 {market?.county}
                    {market?.contact && (
                        <div style={{ marginTop: '8px' }}>📞 {market.contact}</div>
                    )}
                </p>
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {loading && <p style={{ textAlign: 'center' }}>Loading market details...</p>}

            {!loading && products.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666' }}>No products listed at this market</p>
            )}

            {!loading && products.length > 0 && (
                <div>
                    <h3 style={{ color: '#38761D', marginBottom: '15px' }}>Products Available ({products.length})</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e6ffe6' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Product Name</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Unit</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((priceEntry, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                                        {priceEntry.product_id?.name}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {priceEntry.product_id?.category_type}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {priceEntry.product_id?.unit}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#38761D' }}>
                                        {priceEntry.price.toFixed(2)} KES
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MarketProductsPage;
