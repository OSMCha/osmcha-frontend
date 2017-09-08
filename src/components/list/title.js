// @flow
import React from 'react';
import moment from 'moment';

export function Title({ properties, wasOpen, date }: Object) {
  return (
    <div>
      <span className="flex-parent flex-parent--row justify--space-between align-items--center">
        <span className={'txt-m txt-bold mt3 mr6'}>
          {properties.get('user')}
        </span>
        <span className="txt-s mr3">
          &nbsp;{moment(date).fromNow()}
        </span>
      </span>
    </div>
  );
}
