import React from 'react';

const ChartCard = ({ title, children, fullWidth }) => {
  return (
    <div className={`chart-card ${fullWidth ? 'full-width' : ''}`}>
      <h3>{title}</h3>
      <div style={{ position: 'relative', height: '300px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
