// @flow
import React from 'react';
import { Map } from 'immutable';

export function Comment({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number,
  expanded?: boolean
}) {
  const comment = properties.get('comment');
  return (
    <div className="p12 ">
      <div>
        <h2 className="txt-l mr6 txt-bold">Comment</h2>
        <p className="flex-child txt-subhead my3 txt-em ml6">
          {comment}
        </p>
      </div>
    </div>
  );
}
