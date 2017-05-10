// @flow
import React from 'react';
import {Tooltip} from 'react-tippy';

export function CreateDeleteModify(props: Object) {
  const showZero = props.showZero;
  return (
    <div
      className={
        `flex-parent flex-parent--row flex-parent--wrap ${props.className}`
      }
    >
      {(props.create > 0 || showZero) &&
        <div
          className="bg-green-faint mr3 color-green inline-block px6 py3 txt-xs txt-bold round-full"
        >
          {props.create}
        </div>}
      {(props.modify > 0 || showZero) &&
        <div
          className="bg-orange-faint mr3 color-orange inline-block px6 py3 txt-xs txt-bold round-full"
        >
          {props.modify}
        </div>}
      {(props.delete > 0 || showZero) &&
        <div
          className="bg-red-faint color-red inline-block px6 py3 txt-xs txt-bold round-full"
        >
          {props.delete}
        </div>}
    </div>
  );
}
