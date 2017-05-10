import React from 'react';
export const Box = ({children, className}) => (
  <div className="flex-child flex-child--grow wmin480 wmax920">
    <div
      className={
        `m12 border border--gray-light z4 transition bg-white ${className}`
      }
    >
      {children}
    </div>
  </div>
);
