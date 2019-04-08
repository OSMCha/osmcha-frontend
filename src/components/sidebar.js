// @flow
import React, { Children, Element } from 'react';

export function Sidebar({
  title,
  children,
  className
}: {
  title: Element<*>,
  children?: Children,
  className: string
}) {
  return (
    <div
      className={`${className} flex-child  border border--gray-light border--1`}
    >
      {title}
      {children}
    </div>
  );
}
