import React from 'react';

interface LoadingProps {
  height?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ height, className = '' }) => (
  <div
    style={{ height: height || 'auto' }}
    className={`${className} flex-parent flex-parent--column flex-parent--center-cross flex-parent--center-main flex-child--grow`}
  >
    <div className="flex-child loading" />
  </div>
);
