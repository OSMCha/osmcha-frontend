// @flow
import React from 'react';
import { Reasons } from '../reasons';

export function PrimaryLine({ reasons, comment, tags }: Object) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-3-lines my6 txt-break-word">
        {comment}
      </p>
      <Reasons reasons={tags} color="red" />
      <Reasons reasons={reasons} color="green" />
    </span>
  );
}
