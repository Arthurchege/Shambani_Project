// frontend/src/components/TrendCard.jsx - Updated with CSS Classes

import React from 'react';
import TrendChart from './TrendChart';

const TrendCard = ({ trend }) => {
  return (
    // Replaced inline cardStyle with the class name
    <div className="trend-card">
      <h3 className="commodity-title">🌾 {trend.commodity}</h3>
      
      {/* Replaced inline price styling */}
      <p className="price-tag">
        {trend.currentPrice} {trend.unit}
      </p>
      
      {/* Replaced inline region styling */}
      <p className="region-tag">Region: **{trend.region}**</p>
      
      {/* Chart Integration remains the same */}
      <TrendChart data={trend.historicalPrices} />
      
      {/* Replaced inline update time styling */}
      <small className="update-time">
        Last API Fetch: {new Date(trend.updatedAt).toLocaleTimeString()}
      </small>
    </div>
  );
};

export default TrendCard;