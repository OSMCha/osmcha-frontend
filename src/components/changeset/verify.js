import React from 'react';

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
      <select
        className={`select ${className}`}
        value={value}
        onChange={onChange}
      >
        <option value="verify" disabled>
          Verify
        </option>
        {options.map((v, k) => (
          <option value={v.value} key={k} hidden={v.hidden}>
            {v.display}
          </option>
        ))}
      </select>
      <div className="select-arrow" />
    </div>
  );
}
