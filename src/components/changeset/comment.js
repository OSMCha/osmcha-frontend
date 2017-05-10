// @flow
import React from 'react';
import {Map} from 'immutable';

export function Comment(
  {
    properties,
    changesetId,
  }: {properties: Map<string, *>, changesetId: number, expanded?: boolean},
) {
  const comment = properties.get('comment');
  return (
    <div
      className="my12 border border--gray-light z4 transition px18 py12 bg-white"
    >
      <div>
        <h2 className="txt-l mr6">Comment</h2>
        <p className="flex-child txt-subhead my3 txt-em ml6">
          {comment}
        </p>
      </div>
    </div>
  );
}

//  <div className="flex-parent flex-parent--row-reverse">
//         <button className={`btn btn--pill btn--s color-white btn--red`}>
//           Not verified
//         </button>
//       </div>
