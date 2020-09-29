// @flow
import React from 'react';

export function NumberOfComments({ count }: { count: ?number }) {
  return (
    <span className="mr6" title={`${count} comment${count > 1 ? 's' : ''}`}>
      <span>{count}</span>
      <svg className="icon h18 w18 inline-block align-middle color-darken25">
        <use xlinkHref="#icon-contact" />
      </svg>
    </span>
  );
}
