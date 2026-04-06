import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  animation?: 'shimmer' | 'pulse' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  style,
  className = '',
  animation = 'shimmer',
}) => {
  const styles: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const animationClass = animation !== 'none' ? `animation-${animation}` : '';

  return (
    <div
      className={`skeleton variant-${variant} ${animationClass} ${className}`}
      style={styles}
    />
  );
};

export default Skeleton;
