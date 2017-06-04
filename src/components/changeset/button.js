import React from 'react';

export function Button({ active, onClick, children, bg, className }: Object) {
  return (
    <a
      className={`${className} mx6 cursor-pointer txt-s inline-block txt-bold  round p6  
                  ${active ? 'bg-gray-faint' : 'bg-white-on-hover bg-gray'}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
