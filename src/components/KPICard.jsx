import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const KPICard = ({ title, value, subtext, icon, color = 'blue', trend }) => {
  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${color}`}>{icon}</div>
      <div className="kpi-label">{title}</div>
      <div className="kpi-value">{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
        {trend !== undefined && (
          <span 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--text-muted)'
            }}
          >
            {trend > 0 ? <FiTrendingUp /> : trend < 0 ? <FiTrendingDown /> : <FiMinus />}
            {Math.abs(trend)}%
          </span>
        )}
        <div className="kpi-sub">{subtext}</div>
      </div>
    </div>
  );
};

export default KPICard;
