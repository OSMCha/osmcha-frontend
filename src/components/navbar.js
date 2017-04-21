import React from 'react';

export function Navbar({title, className, buttons}) {
  return (
    <div
      className={
        `h48 hmin48 flex-parent px12 bg-gray-dark flex-parent--center-cross justify--space-between ${className} `
      }
    >
      <span className="flex-child ">
        {title || ''}
      </span>
      <span className="btn-grp">
        {buttons}
      </span>
    </div>
  );
}
