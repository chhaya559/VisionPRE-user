import React from 'react';
import Skeleton from './Skeleton';

const GalaCardSkeleton: React.FC = () => (
  <div className="gala-card skeleton-card">
    <div className="card-image-wrapper">
      <Skeleton variant="rectangular" height="200px" />
    </div>
    <div className="card-content">
      <Skeleton variant="text" width="80%" height="24px" className="mb-4" />
      <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="40%" />
      </div>
      <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="60%" />
      </div>
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width="100px" />
        <Skeleton variant="text" width="60px" />
      </div>
      <Skeleton variant="rounded" width="100%" height="40px" style={{ marginTop: '16px' }} />
    </div>
  </div>
);

export default GalaCardSkeleton;
