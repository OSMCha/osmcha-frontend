// @flow
import React from 'react';
import { List } from 'immutable';
export function Reasons({
  reasons,
  color
}: {
  reasons: List<*>,
  color: string
}) {
  const lastIndex = reasons.size - 1;
  return (
    <span className="mb3">
      {reasons.map((r: Map<string, *>, k) =>
        <span key={k}>
          <span
            className={`color-${color}-dark inline-block bg-${color}-faint px6 ${k !==
              0
              ? 'mr3'
              : ''} txt-s txt-bold`}
          >
            {r.get('name')}
          </span>
          {`${k !== lastIndex ? ', ' : ''}`}
        </span>
      )}
    </span>
  );
}
