import React from 'react';
import { Dropdown } from '../dropdown';

export function Verify({ changeset, options, className, onChange, value }) {
  if (changeset.getIn(['properties', 'checked'])) {
    return (
      <button className={'btn btn--pill btn--s color-gray btn--gray-faint'}>
        <a target="_blank" href={'http://hdyc.neis-one.org/?'}>
          {changeset.getIn(['properties', 'harmful']) ? 'Harmful' : 'Good'}
        </a>
      </button>
    );
  }
  return (
    <div className="select-container">
      <Dropdown
        value={[]}
        options={options}
        onChange={onChange}
        display="Verify"
      />
    </div>
  );
}
