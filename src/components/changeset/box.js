import React from 'react';
export const Box = ({children, pullDown, pullUp, className}) => (
  <div className={`mb12 ${className} `}>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullDown}
    </div>

    <div className={`border border--gray-light z4 transition bg-white h-full`}>
      {children}
    </div>
    <div className="flex-parent flex-parent--row flex-parent--center-main">
      {pullUp}
    </div>
  </div>
);
