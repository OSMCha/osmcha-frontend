// @flow
import React from 'react';

export function PrimaryLine({ comment }: { comment: String }) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-3-lines my6">
        {comment}
      </p>
    </span>
  );
}
