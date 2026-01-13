import React from 'react';
import { Reasons } from '../reasons';

export function PrimaryLine({ reasons, comment, tags }: any) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-3-lines my6 txt-break-url">{comment}</p>
      <Reasons reasons={reasons} color="blue" />
      <Reasons reasons={tags} color="red" />
    </span>
  );
}
