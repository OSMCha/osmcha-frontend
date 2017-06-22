// @flow
import React from 'react';
import { CreateDeleteModify } from '../create_delete_modify';

import thumbsUp from '../../assets/thumbs-up.svg';
import thumbsDown from '../../assets/thumbs-down.svg';

export function SecondaryLine({ changesetId, date, properties }: Object) {
  return (
    <span className="flex-parent flex-parent--row justify--space-between txt-light txt-s color-gray">
      <span>
        <span className="mr6">
          {changesetId}
        </span>
        {properties.get('checked')
          ? <span>
              {properties.get('harmful')
                ? <img
                    src={thumbsDown}
                    alt="Marked as bad"
                    className="icon inline-block"
                  />
                : <img
                    src={thumbsUp}
                    alt="Marked as good"
                    className="icon inline-block"
                  />}
              &nbsp; by&nbsp;{properties.get('check_user')}
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
