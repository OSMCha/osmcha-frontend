// @flow
import React from 'react';
import moment from 'moment';

export function SecondaryLine({changesetId, date}: Object) {
  return (
    <span className="flex-parent flex-parent--row txt-light txt-s">
      <span>
        Changeset {changesetId} created &nbsp;
      </span>
      <span>
        {moment(date).fromNow()}
      </span>
    </span>
  );
}
