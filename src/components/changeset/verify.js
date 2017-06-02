import React from 'react';
import { Dropdown } from '../dropdown';

export function Verify({
  changeset,
  options,
  className,
  onChange,
  value,
  onClear,
  username
}) {
  if (changeset.getIn(['properties', 'checked'])) {
    const isHarmful = changeset.getIn(['properties', 'harmful']);
    return (
      <div className="flex-parent-inline">
        <button
          className={`btn btn--pill btn--s btn--pill-hl ${isHarmful ? 'bg-orange-faint color-orange-dark' : 'bg-green-faint color-green'}`}
        >
          {isHarmful ? `👎 ${username}` : `👍 ${username}`}
        </button>
        <button
          className={`btn btn--pill  pl3 btn--s btn--pill-hr  ${isHarmful ? 'bg-orange-faint color-orange-dark' : 'bg-green-faint color-green'}`}
          onClick={onClear}
        >
          <svg className="icon icon--s inline-block align-middle ml3">
            <use xlinkHref="#icon-close" />
          </svg>
        </button>
      </div>
    );
  }
  return (
    <div className="select-container">
      <Dropdown
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        options={options}
        onChange={onChange}
        display="Verify"
      />
    </div>
  );
}
