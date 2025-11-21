// frontend/src/pages/PriceComparisonPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const PriceComparisonPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPriceComparison = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`https://shambani.onrender.com/api/prices/product/${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.product);
                    setPrices(data.priceComparison);
                } else {
                    setError('Failed to load price comparison');
                }
            } catch (err) {
                console.error('Error fetching price comparison:', err);
                setError('Failed to load price comparison');
            } finally {
                setLoading(false);
            }
        };

        fetchPriceComparison();
    }, [productId]);

    // Find min and max prices
    const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : 0;

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
                <h2>{product?.name || 'Product'} Price Comparison</h2>
                <p style={{ fontSize: '0.95em', color: '#666' }}>Unit: {product?.unit}</p>
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {loading && <p style={{ textAlign: 'center' }}>Loading price comparison...</p>}

            {!loading && prices.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666' }}>No price data available for this product</p>
            )}

            {!loading && prices.length > 0 && (
                <div>
                    {/* Summary Statistics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ padding: '15px', backgroundColor: '#e6ffe6', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>Lowest Price</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#38761D' }}>
                                {minPrice.toFixed(2)} KES
                            </div>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: '#fff3e6', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>Average Price</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#FF8C00' }}>
                                {(prices.reduce((sum, p) => sum + p.price, 0) / prices.length).toFixed(2)} KES
                            </div>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>Highest Price</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#cc0000' }}>
                                {maxPrice.toFixed(2)} KES
                            </div>
                        </div>
                    </div>

                    {/* Price Comparison Table */}
                    <h3 style={{ color: '#38761D', marginBottom: '15px' }}>Prices by Market</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e6ffe6' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Market Name</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>County</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Price (KES)</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Vs. Lowest</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((priceEntry, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                                        {priceEntry.market_id?.name}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {priceEntry.market_id?.county}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
                                        {priceEntry.price.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {priceEntry.price === minPrice ? (
                                            <span style={{ color: '#38761D', fontWeight: 'bold' }}>✓ Best</span>
                                        ) : (
                                            <span style={{ color: '#FF8C00' }}>
                                                +{(priceEntry.price - minPrice).toFixed(2)} ({(((priceEntry.price - minPrice) / minPrice * 100).toFixed(1))}%)
                                            </span>
                                        )}
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

export default PriceComparisonPage;
