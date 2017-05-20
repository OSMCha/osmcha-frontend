// @flow
import React from 'react';

export function Button(
  {active, onClick, children, disable, className}: Object,
) {
  return (
    <a
      className={
        `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  
        ${disable ? 'cursor-notallowed' : ''} 
        ${active ? 'bg-gray-light' : ' bg-gray-faint-on-hover'} 
        ${className}
        `
      }
      onClick={disable ? null : onClick}
    >
      {children}
    </a>
  );
}
