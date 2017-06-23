import React from 'react';
import { Dropdown } from '../dropdown';
import thumbsUp from '../../assets/thumbs-up.svg';
import thumbsDown from '../../assets/thumbs-down.svg';

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
          className={`btn btn--s border border--1 round color-gray transition pl12 pr6 ${isHarmful
            ? 'bg-lighten50 border--red-light'
            : 'bg-lighten50 border--green-light'}`}
        >
          <span>
            <img
              src={isHarmful ? thumbsDown : thumbsUp}
              alt={`Marked as ${isHarmful ? 'bad' : 'good'}`}
              className="icon inline-block mt3"
            />
            <span className="ml6">{checkUser}</span>
          </span>
          <svg
            onClick={onClear}
            className="icon inline-block align-middle pl3 pb3 pointer"
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
