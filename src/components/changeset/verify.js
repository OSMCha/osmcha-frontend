import React from 'react';

export function Verify({ options, className, onChange, value }) {
  return (
    <div className="select-container">
      <select
        className={`select ${className}`}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled selected>
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
