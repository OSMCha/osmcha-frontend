import React from 'react';

export const BlockMarkup = ({ children }) => (
  <div className="flex-child flex-child--grow bg-gray-faint mx12 round p12 my6">
    <div className="flex-parent flex-parent--row  justify--space-between">
      {children}
    </div>
  </div>
);
