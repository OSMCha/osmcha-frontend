import React from 'react';
import { Dropdown } from '../dropdown';

export function Verify({
  changeset,
  options,
  className,
  onChange,
  value,
  onClear,
  username,
  checkUser
}) {
  if (changeset.getIn(['properties', 'checked'])) {
    const isHarmful = changeset.getIn(['properties', 'harmful']);
    return (
      <div className="flex-parent-inline">
        <span
          className={`btn btn--s color-gray border border--gray round ${isHarmful ? 'bg-orange-faint' : 'bg-green-faint'}`}
        >
          <span>{isHarmful ? `👎 ${checkUser}` : `👍 ${checkUser}`}</span>
          <svg
            onClick={onClear}
            className="icon inline-block align-middle pointer"
          >
            <use xlinkHref="#icon-close" />
          </svg>
        </span>
      </div>
    );
  }
  return (
    <div className="select-container">
      <Dropdown
        eventTypes={['click', 'touchend']}
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
