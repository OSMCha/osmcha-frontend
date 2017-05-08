// @flow
import React from 'react';
import {Map} from 'immutable';

import {dispatchEvent} from '../../utils/dispatch_event';
import {Header} from './header';
import {CMap} from './map';
import {Loading} from '../loading';

// presentational component for view/changeset.js
export function Changeset(
  {
    changesetId,
    currentChangeset,
    errorChangeset,
    currentChangesetMap,
    errorChangesetMap,
  }: {
    changesetId: number,
    currentChangeset: ?Map<string, *>,
    currentChangesetMap: ?Object,
    errorChangeset: ?Object,
    errorChangesetMap: ?Object,
  },
) {
  if (errorChangeset) {
    console.log('error');
    dispatchEvent('showToast', {
      title: 'changeset failed to load',
      content: 'Try reloading osmcha',
      timeOut: 5000,
      type: 'error',
    });
    console.error(errorChangeset);
    return null;
  }
  if (!currentChangeset) return null;
  const properties = currentChangeset.get('properties');

  return (
    <div className="flex-child flex-child--grow">
      <Header changesetId={changesetId} properties={properties} />
      <div>
        {currentChangesetMap
          ? <CMap changesetId={changesetId} adiffResult={currentChangesetMap} />
          : <Loading />}
      </div>
    </div>
  );
}
