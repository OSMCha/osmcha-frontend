import React from 'react';

export function Navbar({ title, className, buttons }) {
  return (
    <nav
      className={`h55 hmin55 flex-parent px12 py6 bg-gray-dark flex-parent--center-cross justify--space-between ${className}`}
    >
      <div className="flex-child flex-child--grow">{title || ''}</div>
      <div className="flex-child">{buttons}</div>
    </nav>
  );
}
