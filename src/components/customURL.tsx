import React from 'react';

export function CustomURL({ href, children, iconName, className, title }: any) {
  return (
    <a
      href={href}
      className={`${
        className || ''
      } btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken5 bg-lighten25-on-hover color-gray transition`}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
    >
      {iconName && (
        <svg className={'icon txt-m mb3 inline-block align-middle'}>
          <use xlinkHref={`#icon-${iconName}`} />
        </svg>
      )}
      {children}
    </a>
  );
}
