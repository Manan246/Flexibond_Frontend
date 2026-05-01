import React from 'react';

export const parseInline = (text, isRecommendation = false) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const word = part.slice(2, -2);
      return (
        <strong key={i} style={{ color: isRecommendation ? '#0369a1' : '#0f766e', fontWeight: 700 }}>
          {word}
        </strong>
      );
    }
    return part;
  });
};

export const renderInsightsText = (text) => {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim());
  return lines.map((line, i) => {
    const clean = line.replace(/^[-•*]\s*/, '').trim();
    if (!clean) return null;
    const isRec = clean.toLowerCase().startsWith('recommendation:');
    if (isRec) {
      const afterLabel = clean.replace(/^recommendation:\s*/i, '');
      return (
        <li key={i} style={{ marginBottom: '8px', listStyle: 'none', paddingLeft: 0 }}>
          <span style={{ fontWeight: 700, color: '#0369a1' }}>Recommendation: </span>
          <span>{parseInline(afterLabel, true)}</span>
        </li>
      );
    }
    return (
      <li key={i} style={{ marginBottom: '8px' }}>
        {parseInline(clean)}
      </li>
    );
  });
};
