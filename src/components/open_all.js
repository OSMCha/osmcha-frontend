// @flow
import React from 'react';

type propsType = {|
  isActive: boolean,
  setOpenAll: Function
|};

export const OpenAll = ({ isActive, setOpenAll }: propsType) => (
  <div className="inline-block fr">
    <span
      className="txt-s txt-underline pointer"
      onClick={() => setOpenAll(!isActive)}
    >
      {isActive ? 'Close all' : 'Open all'}
    </span>
  </div>
);
