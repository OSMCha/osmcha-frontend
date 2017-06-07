// @flow
import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

import { CreateDeleteModify } from '../create_delete_modify';
import { Details } from './details';

export function Header({
  properties,
  changesetId,
  userEditCount
}: {
  properties: Map<string, *>,
  changesetId: number,
  userEditCount: number
}) {
  const user = properties.get('user');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');

  return (
    <div className="p18">
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap">
        <div className="flex-parent flex-parent--row justify--space-between">
          <h2 className="txt-l mr6 txt-bold">Changeset Details</h2>
          <div>
            <CreateDeleteModify
              showZero
              className="mr3"
              create={create}
              modify={modify}
              delete={destroy}
            />
          </div>
        </div>
        <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
          <span className="txt-s">

            <span className="txt-underline-on-hover txt-bold">
              <a
                target="_blank"
                href={`https://openstreetmap.org/user/${user}`}
              >
                {user}({userEditCount})&nbsp;
              </a>
            </span>
            created&nbsp;{moment(date).fromNow()}
          </span>
        </div>
      </div>
      <Details changesetId={changesetId} properties={properties} />
    </div>
  );
}

// Reasons
//
// <div
//   className="flex-parent flex-parent--column flex-parent--end-cross"
//   style={{ position: 'relative', right: -24, top: -5 }}
// >
//   {reasons.map((r, k) => (
//     <span key={k} className="my3">
//       <span className="bg-blue border border--blue-dark color-white px6 py3 txt-s txt-bold border">
//         {r}
//       </span>
//     </span>
//   ))}
// </div>
