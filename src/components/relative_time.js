import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export function RelativeTime({ datetime, addSuffix = true }: Object) {
  return (
    <time datetime={datetime.toISOString()} title={datetime.toString()}>
      {formatDistanceToNow(datetime, { addSuffix })}
    </time>
  );
}
