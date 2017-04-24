import React from 'react';

export function Navbar({title, className, buttons}) {
  return (
    <div
      className={
        `h55 hmin55 flex-parent px12 bg-gray-dark flex-parent--center-cross justify--space-between ${className} `
      }
    >
      <span className="flex-child flex-child--grow">
        {title || ''}
      </span>
      <span className="btn-grp">
        {buttons}
      </span>
    </div>
  );
}
