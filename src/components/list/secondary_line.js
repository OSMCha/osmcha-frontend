// @flow
import React from 'react';
import moment from 'moment';
import { CreateDeleteModify } from '../create_delete_modify';

export function SecondaryLine({ changesetId, date, properties }: Object) {
  return (
    <span className="flex-parent flex-parent--row justify--space-between txt-light txt-s color-gray">
      <span>
        <span>
          {changesetId}
        </span>
        <span>
          created &nbsp;{moment(date).fromNow()}
        </span>
      </span>
      <CreateDeleteModify
        showZero
        className="mr3 pb3"
        create={properties.get('create')}
        modify={properties.get('modify')}
        delete={properties.get('delete')}
      />
    </span>
  );
}
