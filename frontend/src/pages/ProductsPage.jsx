// frontend/src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProductsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`https://shambani.onrender.com/api/products/byCategory/${categoryId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                    
                    // Fetch category details
                    const categoryRes = await fetch(`https://shambani.onrender.com/api/categories`);
                    if (categoryRes.ok) {
                        const categories = await categoryRes.json();
                        const currentCategory = categories.find(cat => cat._id === categoryId);
                        if (currentCategory) {
                            setCategory(currentCategory);
                        }
                    }
                } else {
                    setError('Failed to load products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const handleProductClick = (productId) => {
        navigate(`/prices/compare/${productId}`);
    };

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
                <h2>{category?.name || 'Products'}</h2>
                <p>Select a product to compare prices across markets</p>
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {loading && <p style={{ textAlign: 'center' }}>Loading products...</p>}

            {!loading && products.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666' }}>No products found in this category</p>
            )}

            {!loading && products.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                    {products.map(product => (
                        <button
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            style={{
                                padding: '20px',
                                backgroundColor: '#f5f5f5',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e6f3ff';
                                e.currentTarget.style.borderColor = '#007BFF';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                e.currentTarget.style.borderColor = '#ddd';
                            }}>
                            <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                                {product.name}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#666' }}>
                                📊 {product.unit}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
