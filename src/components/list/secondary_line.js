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
        {properties.get('checked')
          ? <span>
              {properties.get('harmful') ? '👎 ' : '👍'}
              &nbsp; by &nbsp;{properties.get('check_user')}
            </span>
          : null}
      </span>
      <span className="flex-parent flex-parent--row">
        <CreateDeleteModify
          showZero
          className="mr3"
          create={properties.get('create')}
          modify={properties.get('modify')}
          delete={properties.get('delete')}
        />

      </span>
    </span>
  );
}
//  <svg className="icon inline-block align-middle "> //       <use xlinkHref="#icon-options" /> //     </svg>
