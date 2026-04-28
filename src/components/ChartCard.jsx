import React from 'react';
import AIInsightButton from './AIInsightButton';

const ChartCard = ({ title, children, fullWidth, extra, aiContext, aiType }) => {
  return (
    <div className={`chart-card ${fullWidth ? 'full-width' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {extra}
          {aiContext && <AIInsightButton contextData={aiContext} contextType={aiType || title} title={`AI Insights for ${title}`} />}
        </div>
      </div>
      <div style={{ position: 'relative', height: '300px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
