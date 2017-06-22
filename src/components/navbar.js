import React from 'react';

export function Navbar({ title, className, buttons }) {
  return (
    <div
      className={`h55 hmin55 flex-parent px12 pb6 bg-gray-dark flex-parent--center-cross justify--space-between ${className}`}
    >
      <span className="flex-child flex-child--grow">
        {title || ''}
      </span>
      <span className="flex-child">
        {buttons}
      </span>
    </div>
  );
}
