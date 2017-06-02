// @flow
import React from 'react';
import { Reasons } from '../reasons';

export function PrimaryLine({ reasons, comment }: Object) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-3-lines my6">
        {comment}
      </p>
      <Reasons reasons={reasons} />
    </span>
  );
}
