// @flow
import React from 'react';

type propsType = {|
  isActive: boolean,
  setOpenAll: Function
|};

export const OpenAll = ({ isActive, setOpenAll }: propsType) => (
  <div className="inline-block fr">
    <button
      className="txt-s txt-underline pointer"
      onClick={() => setOpenAll(!isActive)}
      role="switch"
      aria-checked={isActive}
      tabIndex="0"
    >
      {isActive ? 'Close all' : 'Open all'}
    </button>
  </div>
);
