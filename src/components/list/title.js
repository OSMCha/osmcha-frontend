// @flow
import React from 'react';
import {CreateDeleteModify} from './create_delete_modify';

export function Title({properties, wasOpen}: Object) {
  return (
    <span
      className="flex-parent flex-parent--row flex-parent--center-cross flex-parent--wrap"
    >
      <span className={`txt-m ${wasOpen ? '' : 'txt-bold'} mt3 mr6`}>
        {properties.get('user')}
      </span>
      <span>
        {properties.get('reasons').map((r, k) => (
          <div
            key={k}
            className="bg-blue-faint mr3 color-blue inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {r}
          </div>
        ))}
      </span>
      <CreateDeleteModify
        className="mr3"
        create={properties.get('create')}
        modify={properties.get('modify')}
        delete={properties.get('delete')}
      />
    </span>
  );
}
