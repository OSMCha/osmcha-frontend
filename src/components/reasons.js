// @flow
import React from 'react';
import { List } from 'immutable';

export function Reasons({
  reasons,
  underline,
  color
}: {
  reasons: List<*>,
  underline: boolean,
  color: string
}) {
  const extraClass = underline ? 'txt-underline-dotted' : '';
  return (
    <span className="mb3">
      {reasons.map((r: Map<string, *>, k) => (
        <span key={k} className="mr6">
          <span
            className={`color-${color}-dark inline-block bg-${color}-faint px6 txt-s txt-bold ${extraClass}`}
          >
            {r.get('name')}
          </span>
        </span>
      ))}
    </span>
  );
}
