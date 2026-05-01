import React, { useState } from 'react';
import { FiZap, FiRotateCcw } from 'react-icons/fi';
import AIInsightButton from './AIInsightButton';
import { renderInsightsText } from '../utils/aiUtils.jsx';

const ChartCard = ({ title, children, fullWidth, extra, aiContext, aiType }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [insights, setInsights] = useState(null);

  const handleAIButtonClick = (flipped, data) => {
    if (data) setInsights(data);
    setIsFlipped(flipped);
  };

  return (
    <div className={`flip-card ${fullWidth ? 'full-width' : ''} ${isFlipped ? 'is-flipped' : ''}`}>
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {extra}
              {aiContext && (
                <AIInsightButton 
                  contextData={aiContext} 
                  contextType={aiType || title} 
                  title={`AI Insights for ${title}`} 
                  onToggle={handleAIButtonClick}
                />
              )}
            </div>
          </div>
          <div style={{ position: 'relative', flex: 1, width: '100%' }}>
            {children}
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back chart-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiZap /> AI Insights: {title}
            </h3>
            <button 
              onClick={() => setIsFlipped(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--text-secondary)'
              }}
            >
              <FiRotateCcw size={14} /> Flip Back
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', paddingRight: '8px' }}>
            {insights ? (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {renderInsightsText(insights)}
              </ul>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <FiZap size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p>Generating insights...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
