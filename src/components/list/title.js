// @flow
import React from 'react';
import moment from 'moment';

export function Title({ properties, wasOpen, date }: Object) {
  return (
    <div>
      <span className="flex-parent flex-parent--row justify--space-between align-items--center">
        <strong className={'txt-m mt3 mr6'}>
          {properties.get('user') || <i>OSM User</i>}
        </strong>
        <span className="txt-s mr3">&nbsp;{moment(date).fromNow()}</span>
      </span>
    </div>
  );
}
