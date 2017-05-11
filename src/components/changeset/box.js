import React from 'react';
export const Box = ({children, pullDown, pullUp, className, bg}) => (
  <div className={`mb12 ${className} `}>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullDown}
    </div>

    <div
      className={
        `border border--gray-light z4 transition h-full bg-white ${bg}`
      }
    >
      {children}
    </div>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullUp}
    </div>
  </div>
);
