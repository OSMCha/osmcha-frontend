// @flow
import React from 'react';

import { CreateDeleteModify } from '../create_delete_modify';
import { Reasons } from '../reasons';
export function Title({ properties, wasOpen }: Object) {
  return (
    <span className="flex-parent flex-parent--row flex-parent--center-cross flex-parent--wrap">
      <span className={`txt-m ${wasOpen ? '' : 'txt-bold'} mt3 mr6`}>
        {properties.get('user')}
      </span>
      <Reasons reasons={properties.get('reasons')} />
      <CreateDeleteModify
        className="mr3"
        create={properties.get('create')}
        modify={properties.get('modify')}
        delete={properties.get('delete')}
      />
    </span>
  );
}
