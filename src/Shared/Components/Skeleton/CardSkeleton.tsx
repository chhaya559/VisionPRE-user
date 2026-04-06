import React from 'react';
import Skeleton from './Skeleton';

const CardSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <div style={{ padding: '16px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
    <Skeleton variant="rectangular" height={height} className="mb-4" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="40%" />
  </div>
);

export default CardSkeleton;
