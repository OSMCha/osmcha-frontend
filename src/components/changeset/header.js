// @flow
import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

import { CreateDeleteModify } from '../create_delete_modify';
import { Details } from './details';

export function Header({
  properties,
  changesetId,
  userEditCount,
  toggleUser
}: {
  properties: Map<string, *>,
  changesetId: number,
  userEditCount: number,
  toggleUser: () => mixed
}) {
  const user = properties.get('user');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');

  return (
    <div className="px12 py6">
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap">
        <div className="flex-parent flex-parent--row justify--space-between">
          <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Details</h2>
          <div>
            <CreateDeleteModify
              showZero
              className="mr3 mt3"
              create={create}
              modify={modify}
              delete={destroy}
            />
          </div>
        </div>
        <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
          <span className="txt-s">
            <span className="txt-underline-on-hover pointer txt-bold">
              <a onClick={toggleUser}>
                {user}
              </a>
            </span>
            &nbsp;
            <span className="txt-s txt-em">
              ({userEditCount} edits)
            </span>&nbsp;
            created&nbsp;{moment(date).fromNow()}
          </span>
        </div>
      </div>
      <Details changesetId={changesetId} properties={properties} />
    </div>
  );
}
