// @flow
import React from 'react';
import {Map} from 'immutable';
import {Header} from './changeset_header';
import {CMap} from './changeset_map';

// presentational component for view/changeset.js
export function Changeset(
  {
    changeset,
    currentChangesetMap,
  }: {changeset: ?Map<string, *>, currentChangesetMap: ?Object},
) {
  if (!changeset) return null;
  console.log(changeset.toJS());
  const properties = changeset.get('properties');
  return (
    <div>
      <Header
        changesetId={changeset.get('id')}
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
        ? <CMap
            changesetId={changeset.get('id')}
            adiffResult={currentChangesetMap}
          />
        : null}
    </div>
  );
}
