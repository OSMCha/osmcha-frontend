// @flow
import React from 'react';

export function Reasons({ reasons }: Object) {
  return (
    <span>
      {reasons.map((r, k) => (
        <div
          key={k}
          className=" color-gray inline-block px3 txt-mono txt-capitalize mr3 txt-s txt-bold txt-underline round-full"
        >
          {r.get('name')}
        </div>
      ))}
    </span>
  );
}
