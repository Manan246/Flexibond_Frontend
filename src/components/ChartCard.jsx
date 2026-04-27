import React from 'react';

const ChartCard = ({ title, children, fullWidth, extra }) => {
  return (
    <div className={`chart-card ${fullWidth ? 'full-width' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {extra}
      </div>
      <div style={{ position: 'relative', height: '300px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
