import React from 'react';

export function Button({ active, onClick, children, icon, className }: Object) {
  return (
    <button
      onClick={onClick}
      className={`btn btn--s color-gray border border--gray round bg-gray-faint bg-white-on-hover ${active ? active : ''}`}
    >
      <span>

        {children}
      </span>

      {icon}

    </button>
  );
}
