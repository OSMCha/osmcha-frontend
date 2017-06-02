// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';

export function CreateDeleteModify(props: Object) {
  const showZero = props.showZero;
  return (
    <div
      className={`flex-parent flex-parent--row flex-parent--wrap ${props.className}`}
    >
      {(props.create > 0 || showZero) &&
        <div className="cmap-bg-create mr3 color-white inline-block px6 py3 mr6 txt-s txt-bold round">
          {props.create}
        </div>}
      {(props.modify > 0 || showZero) &&
        <div className="cmap-bg-modify-old mr3 color-white inline-block px6 py3 mr6 txt-s txt-bold round">
          {props.modify}
        </div>}
      {(props.delete > 0 || showZero) &&
        <div className="cmap-bg-delete color-white inline-block px6 py3 mr6 txt-s txt-bold round">
          {props.delete}
        </div>}
    </div>
  );
}
