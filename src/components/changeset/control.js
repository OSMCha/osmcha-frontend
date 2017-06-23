import React from 'react';

export function Control({ active, onClick, children, bg, className }: Object) {
  return (
    <a
      className={`${className} mx6 cursor-pointer txt-s inline-block txt-bold round p6 transition color-darken75
                  ${active ? 'bg-white' : 'bg-white-on-hover bg-lighten50'}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
