import React from 'react';
export const Box = ({ children, pullDown, pullUp, className, style, bg }) => (
  <div className={`mb3 z4 transition bg-white ${className}`} style={style}>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullDown}
    </div>
    <div className={`${bg} h-full`}>
      {children}
    </div>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullUp}
    </div>
  </div>
);
