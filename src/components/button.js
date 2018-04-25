import React from 'react';

export function Button({
  onClick,
  children,
  iconName,
  className,
  activeBtn
}: Object) {
  return (
    <button
      onClick={onClick}
      className={`${className ||
        ''} btn btn--s border border--1 round color-gray ${
        activeBtn
          ? 'border--darken10 border--darken50-on-hover bg-darken25 bg-darken10-on-hover'
          : 'border--darken5 border--darken25-on-hover bg-darken10 bg-darken5-on-hover'
      } transition ${iconName && children ? 'pl12 pr6' : ''}`}
    >
      {children}
      {iconName && (
        <svg
          className={`icon w18 h18 inline-block align-middle ${
            children ? 'pl3 pb3' : 'pb3'
          }`}
        >
          <use xlinkHref={`#icon-${iconName}`} />
        </svg>
      )}
    </button>
  );
}
