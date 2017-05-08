// @flow
import React from 'react';

export function PrimaryLine({comment}: {comment: String}) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-2-lines my3 txt-em">
        {comment}
      </p>
    </span>
  );
}
