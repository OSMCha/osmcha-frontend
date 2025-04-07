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
      <div
        className={`flex-parent align-items--center btn btn--s border border--1 round color-gray transition pl12 pr6 ${
          isHarmful
            ? 'bg-lighten50 border--red-light'
            : 'bg-lighten50 border--green-light'
        }`}
        style={{ maxWidth: '100px' }}
      >
        <img
          src={isHarmful ? thumbsDown : thumbsUp}
          alt={`Marked as ${isHarmful ? 'bad' : 'good'}`}
          className="icon inline-block w14 h14"
        />
        <span
          className="ml6"
          style={{
            flex: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {checkUser ? <>{checkUser}</> : <em>Verified</em>}
        </span>
        <svg
          onClick={onClear}
          className="icon inline-block align-middle pl3 w18 h18 cursor-pointer color-gray"
        >
          <use xlinkHref="#icon-close" />
        </svg>
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
        position="right"
      />
    </div>
  );
}
