// @flow
import React from 'react';
import { Range } from 'immutable';

import { PageRange } from './page_range';
import { PAGE_SIZE } from '../../config/constants';

const RANGE = 6;

function range(start, end) {
  return Range(start, end).map((k, i) => i + start);
}

export function Footer({
  pageIndex,
  getChangesetsPage,
  count
}: {
  pageIndex: number,
  getChangesetsPage: (number, ?boolean) => mixed,
  count: ?number
}) {
  const base = parseInt(pageIndex / RANGE, 10) * RANGE;
  let maxPageCount = 0;
  if (count && !Number.isNaN(count)) {
    maxPageCount = Math.ceil(count / PAGE_SIZE);
  }
  return (
    <footer className="hmin55 p12 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
      <PageRange
        page={'arrow-left'}
        pageIndex={pageIndex - 1}
        disabled={pageIndex - 1 === -1}
        active={false}
        getChangesetsPage={getChangesetsPage}
      />
      {range(base, Math.min(base + RANGE, maxPageCount)).map(n =>
        <PageRange
          key={n}
          page={n}
          pageIndex={n}
          active={n === pageIndex}
          getChangesetsPage={getChangesetsPage}
        />
      )}
      <PageRange
        page={'arrow-right'}
        disabled={pageIndex + 1 >= maxPageCount}
        pageIndex={pageIndex + 1}
        active={false}
        getChangesetsPage={getChangesetsPage}
      />
    </footer>
  );
}
