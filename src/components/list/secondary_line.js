// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import { CreateDeleteModify } from '../create_delete_modify';
import { NumberOfComments } from './comments';
import { getObjAsQueryParam } from '../../utils/query_params';

import thumbsUp from '../../assets/thumbs-up.svg';
import thumbsDown from '../../assets/thumbs-down.svg';

export function SecondaryLine({ changesetId, date, properties }: Object) {
  return (
    <span className="flex-parent flex-parent--row justify--space-between txt-light txt-s color-gray">
      <span>
        <Link
          to={{
            search: window.location.search,
            pathname: `/changesets/${changesetId}`
          }}
          className="txt-underline-on-hover"
        >
          <span className="mr6">{changesetId}</span>
        </Link>
        {properties.get('checked') ? (
          <Link
            to={{
              search: getObjAsQueryParam('filters', {
                users: [
                  {
                    label: properties.get('check_user'),
                    value: properties.get('check_user')
                  }
                ],
                date__gte: [{ label: '', value: '' }]
              }),
              pathname: '/'
            }}
            title={`See ${properties.get('check_user')}'s changesets`}
            className="txt-underline-on-hover"
          >
            {properties.get('harmful') ? (
              <img
                src={thumbsDown}
                alt="Marked as bad"
                className="icon inline-block"
              />
            ) : (
              <img
                src={thumbsUp}
                alt="Marked as good"
                className="icon inline-block"
              />
            )}
            {properties.get('check_user') && (
              <span className="pl6">{`by ${properties.get(
                'check_user'
              )}`}</span>
            )}
          </Link>
        ) : null}
      </span>
      <span className="flex-parent flex-parent--row">
        {properties.get('comments_count') > 0 && (
          <NumberOfComments count={properties.get('comments_count')} />
        )}
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
