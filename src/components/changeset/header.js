// @flow
import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

import { CreateDeleteModify } from '../create_delete_modify';
import { Details } from './details';

export function Header({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number
}) {
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  const user = properties.get('user');
  return (
    <div className="p12">
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap border-b border--gray-light">
        <div className="flex-parent flex-parent--row justify--space-between flex-parent--center-cross">
          <h2 className="txt-l mr6 txt-bold">{user}</h2>
          <div
            className="flex-parent flex-parent--column flex-parent--end-cross"
            style={{ position: 'relative', right: -24, top: -5 }}
          >
            {reasons.map((r, k) => (
              <span key={k} className="my3">
                <span className="bg-blue border border--blue-dark color-white px6 py3 txt-s txt-bold border">
                  {r}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
          <span className="">
            <span className="txt-underline-on-hover txt-em">
              {changesetId} &nbsp;
            </span>
            <span>
              created &nbsp;{moment(date).fromNow()}
            </span>
          </span>
          <div className="flex-parent flex-parent--column">
            <CreateDeleteModify
              showZero
              className="mr3 pb3"
              create={create}
              modify={modify}
              delete={destroy}
            />
          </div>
        </div>
      </div>
      <Details changesetId={changesetId} properties={properties} />

    </div>
  );
}
