import React from 'react';

export function Button({ active, onClick, children, bg, className }: Object) {
  return (
    <a
      className={`${className} mx6 cursor-pointer txt-s inline-block txt-bold transition round p6  
                  ${active ? `bg-white` : `bg-white-on-hover bg-gray-light`}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
