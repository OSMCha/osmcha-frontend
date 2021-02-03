import React from 'react';

export function CustomURL({ href, children, iconName, className }: Object) {
  return (
    <a
      href={href}
      className={`${className ||
        ''} btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {iconName && (
        <svg className={'icon inline-block align-middle'}>
          <use xlinkHref={`#icon-${iconName}`} />
        </svg>
      )}
    </a>
  );
}
