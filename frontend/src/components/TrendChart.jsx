// frontend/src/components/TrendChart.jsx

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data }) => {
  // Use the last 7 data points for a clean, minimal chart
  const recentData = data.length > 0 ? 
    data.slice(-7).map(item => ({ 
      name: new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' }),
      price: item.price
    })) : 
    [];

  return (
    <div style={{ width: '100%', height: 70, marginTop: 10 }}>
      {recentData.length > 1 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={recentData} 
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#4CAF50" // SDG-friendly green color
              strokeWidth={2} 
              dot={false} // Hides points for a smoother look
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{textAlign: 'center', color: '#666', fontSize: '0.8em'}}>Data insufficient for chart visualization.</p>
      )}
    </div>
  );
};

export default TrendChart;