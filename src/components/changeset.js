// @flow
import React from 'react';
import {Map} from 'immutable';
import {Header} from './changeset_header';
import {CMap} from './changeset_map';
import {dispatchEvent} from '../utils/dispatch_event';

// presentational component for view/changeset.js
export function Changeset(
  {
    changesetId,
    currentChangeset,
    errorChangeset,
    currentChangesetMap,
    errorChangesetMap,
  }: {
    changesetId: ?number,
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
    <div>
      <Header
        changesetId={changesetId}
        date={properties.get('date')}
        create={properties.get('create')}
        modify={properties.get('modify')}
        delete={properties.get('delete')}
        reasons={properties.get('reasons')}
        source={properties.get('source')}
        editor={properties.get('editor')}
        comment={properties.get('comment')}
        imagery={properties.get('imagery_used')}
      />
      {currentChangesetMap
        ? <CMap changesetId={changesetId} adiffResult={currentChangesetMap} />
        : null}
    </div>
  );
}
