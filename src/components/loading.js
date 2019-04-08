import React from 'react';

export const Loading = ({ height, className }) => (
  <div
    style={{ height: height ? height : 'auto' }}
    className={`${className} flex-parent flex-parent--column flex-parent--center-cross flex-parent--center-main flex-child--grow`}
  >
    <div className="flex-child loading" />
  </div>
);
