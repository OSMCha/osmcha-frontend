import React from 'react';

export function Control({ active, onClick, children, className }: Object) {
  return (
    <span
      className={`${className} mx6 cursor-pointer txt-s inline-block txt-bold round p6 transition color-darken75
         ${active ? 'bg-gray-faint' : 'bg-white-on-hover bg-lighten50'}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
