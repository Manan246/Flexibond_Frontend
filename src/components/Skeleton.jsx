import React from 'react';

export const Skeleton = ({ className, style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const KPISkeleton = () => (
  <div className="kpi-grid">
    {[1, 2, 3, 4, 5].map(i => (
      <Skeleton key={i} className="skeleton-kpi" />
    ))}
  </div>
);

export const ChartSkeleton = ({ fullWidth }) => (
  <div className="chart-card" style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <div style={{ padding: '24px' }}>
      <Skeleton className="skeleton-text" style={{ width: '40%', marginBottom: '24px' }} />
      <Skeleton className="skeleton-chart" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="data-table-wrapper" style={{ gridColumn: '1 / -1' }}>
    <div style={{ padding: '24px' }}>
      <Skeleton className="skeleton-text" style={{ width: '20%', marginBottom: '20px' }} />
      <Skeleton className="skeleton-table" />
    </div>
  </div>
);

export default Skeleton;
