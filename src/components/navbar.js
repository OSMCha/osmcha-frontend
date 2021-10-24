import React from 'react';
import { isMobile } from '../utils';

export function Navbar({
  className,
  title,
  titleClassName = '',
  buttons,
  buttonsClassName = ''
}) {
  const mobile = isMobile();

  return (
    <nav
      className={`
        ${mobile ? 'h40' : 'h55 flex-parent--center-cross'}
        flex-parent px12 py6 bg-gray-dark justify--space-between ${className}
      `}
    >
      <div className={`flex-child flex-child--grow ${titleClassName}`}>
        {title || ''}
      </div>
      <div className={`flex-child ${buttonsClassName}`}>{buttons}</div>
    </nav>
  );
}
