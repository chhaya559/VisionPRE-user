import React from 'react';
import Skeleton from './Skeleton';

const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="list-skeleton">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
        <Skeleton variant="circular" width={40} height={40} className="me-3" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export default ListSkeleton;
