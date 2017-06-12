import React from 'react';
export function Wrapper({ display, children }) {
  return (
    <div className="ml3 my12  flex-parent flex-parent--column">
      <span className="flex-parent flex-parent--row flex-parent--center-cross">
        <span className="txt-bold txt-truncate pointer">
          {display}:&nbsp;
        </span>
      </span>
      <span>{children}</span>
    </div>
  );
}
