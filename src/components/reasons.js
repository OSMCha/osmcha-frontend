// @flow
import React from 'react';
import { List } from 'immutable';

export function Reasons({ reasons }: { reasons: List<any> }) {
  const lastIndex = reasons.size - 1;
  return (
    <span>
      {reasons.map((r, k) => (
        <span key={k}>
          <span className=" color-green-dark bg-green-faint inline-block px3 txt-mono mr3 txt-s txt-bold txt-underline">
            {r.get('name')}
          </span>
          {`${k !== lastIndex ? ', ' : ''}`}
        </span>
      ))}
    </span>
  );
}
