// @flow
import React from 'react';
import moment from 'moment';

export function SecondaryLine({ changesetId, date }: Object) {
  return (
    <span className="flex-parent flex-parent--row justify--space-between txt-light txt-s color-gray">
      <span>
        Changeset: {changesetId}
      </span>
      <span>
        created &nbsp;{moment(date).fromNow()}
      </span>
    </span>
  );
}
