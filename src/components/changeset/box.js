import React from 'react';
export const Box = ({children, pullDown, pullUp, className}) => (
  <div className="m12  flex-child flex-child--grow wmin480 wmax920">
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullDown}
    </div>
    <div
      className={
        `border border--gray-light z4 transition bg-white ${className}`
      }
    >
      {children}
    </div>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullUp}
    </div>
  </div>
);
