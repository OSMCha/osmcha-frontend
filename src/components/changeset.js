// @flow
import React from 'react';
import {Map} from 'immutable';
import {Header} from './changeset_header';
// presentational component for view/changeset
export function Changeset({changeset}: {changeset: ?Map<string, *>}) {
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
      {JSON.stringify(changeset.toJS())}
    </div>
  );
}
