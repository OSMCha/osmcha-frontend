// @flow
import React from 'react';

export function Reasons({ reasons }: Object) {
  return (
    <span>
      {reasons.map((r, k) => (
        <div
          key={k}
          className="bg-blue-faint mr3 color-blue inline-block px6 py3 txt-xs txt-bold round-full"
        >
          {r}
        </div>
      ))}
    </span>
  );
}
