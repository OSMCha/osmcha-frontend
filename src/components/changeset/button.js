import React from 'react';

export function Button({active, onClick, children}: Object) {
  return (
    <a
      className={
        `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  
                      ${active ? 'bg-gray-light' : ' bg-gray-faint-on-hover'}
                    `
      }
      onClick={onClick}
    >
      {children}
    </a>
  );
}