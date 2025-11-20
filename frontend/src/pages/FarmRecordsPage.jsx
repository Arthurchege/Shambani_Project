// frontend/src/pages/FarmRecordsPage.jsx - FINAL COMPLETE UI AND RBAC

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const initialFormState = {
    commodity: '',
    recordType: 'Stock',
    quantity: 0,
    unit: '',
    price: 0
};

const FarmRecordsPage = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 
    
    // Define privileged roles for submission/deletion
    const allowedToSubmit = user?.role === 'admin' || user?.role === 'data_entry';

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/records', {
                headers: { 'x-auth-token': token } 
            });
            const data = await res.json();
            
            if (res.ok) {
                setRecords(data);
            } else {
                setError(data.msg || 'Failed to fetch records.');
            }
        } catch (err) {
            setError('Network error: Could not connect to records API.');
        } finally {
            setLoading(false);
        }
    }, [token]); 

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchRecords(); 
    }, [token, navigate, fetchRecords]); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!allowedToSubmit) { 
            setError("Internal Error: Submission blocked by role restrictions.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/records', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                setFormData(initialFormState); 
                fetchRecords(); 
            } else {
                const data = await res.json();
                setError(data.msg || 'Failed to save record. Check form data.');
            }
        } catch (err) {
            setError('Network error during submission.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
        
        if (!allowedToSubmit) { // Client-side check
            alert("Permission denied. Only 'data_entry' or 'admin' can delete records.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/records/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                fetchRecords(); 
            } else {
                alert('Deletion failed. You may not be authorized.');
            }
        } catch (err) {
            alert('Network error during deletion.');
        }
    };

    if (loading) return <div className="shambani-container">Loading your personalized records...</div>;

    return (
        <div className="shambani-container" style={{maxWidth: '800px'}}>
            <Sidebar />
            
            <header style={{textAlign: 'center', paddingTop: '20px'}}>
                <h2>Personalized Farm Records</h2>
                
                {/* --- CONDITIONAL GREETING (Visible ONLY for Admin/Data Entry) --- */}
                {allowedToSubmit && (
                    <p style={{marginTop: '5px', fontWeight: 'bold', color: '#38761D'}}>
                        Welcome, {user?.username}. You have **{user?.role}** access.
                    </p>
                )}
                {/* --- END CONDITIONAL GREETING --- */}
                
            </header>

            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            {/* --- Record Submission Form (CONDITIONAL RENDERING) --- */}
            {allowedToSubmit ? (
                <div style={{border: '1px solid #ddd', padding: '15px', marginBottom: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
                    <h3 style={{marginTop: 0, color: '#38761D'}}>Add New Record</h3>
                    <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px'}}>
                        <input type="text" name="commodity" placeholder="Commodity" value={formData.commodity} onChange={handleChange} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2'}}/>
                        <select name="recordType" value={formData.recordType} onChange={handleChange} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
                            <option value="Stock">Stock</option>
                            <option value="Sale">Sale</option>
                            <option value="Input">Input</option>
                        </select>
                        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
                        <input type="text" name="unit" placeholder="Unit (e.g., Bag)" value={formData.unit} onChange={handleChange} required style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
                        <input type="number" name="price" placeholder="Price (KES)" value={formData.price} onChange={handleChange} style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}/>
                        <button type="submit" style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 0', borderRadius: '5px', cursor: 'pointer', gridColumn: 'span 6', fontWeight: 'bold'}}>Save Record</button>
                    </form>
                </div>
            ) : (
                // This renders a simple blank space for the 'farmer' role.
                <div style={{marginBottom: '25px'}}></div> 
            )}

            {/* --- Records Table/List --- */}
            <h3>Your Records ({records.length})</h3>
            <table style={{width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
                <thead>
                    <tr style={{backgroundColor: '#e6ffe6'}}>
                        <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'left'}}>Commodity</th>
                        <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'left'}}>Type</th>
                        <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'left'}}>Quantity & Unit</th>
                        <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'left'}}>Price (KES)</th>
                        <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record._id} style={{backgroundColor: 'white'}}>
                            <td style={{padding: '10px', border: '1px solid #ddd'}}>{record.commodity}</td>
                            <td style={{padding: '10px', border: '1px solid #ddd'}}>{record.recordType}</td>
                            <td style={{padding: '10px', border: '1px solid #ddd'}}>{record.quantity} {record.unit}</td>
                            <td style={{padding: '10px', border: '1px solid #ddd'}}>{record.price}</td>
                            <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>
                                {allowedToSubmit && (
                                    <button onClick={() => handleDelete(record._id)} style={{backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9em'}}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
};

export default FarmRecordsPage;