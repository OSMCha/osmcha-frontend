import React from 'react';

export function Button({ active, onClick, children, bg, className }: Object) {
  return (
    <a
      className={`${className} mx6 cursor-pointer txt-s inline-block txt-bold transition round p6  
                  ${active ? `bg-${bg}` : `x bg-${bg}-light-on-hover bg-${bg}-faint`}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
