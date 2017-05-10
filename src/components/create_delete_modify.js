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
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Created</span>}
          animation="perspective"
        >
          <div
            className="bg-green-faint mr3 color-green inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.create}
          </div>
        </Tooltip>}
      {(props.modify > 0 || showZero) &&
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Modified</span>}
          animation="perspective"
        >
          <div
            className="bg-orange-faint mr3 color-orange inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.modify}
          </div>{' '}
        </Tooltip>}
      {(props.delete > 0 || showZero) &&
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Deleted</span>}
          animation="perspective"
        >
          <div
            className="bg-red-faint color-red inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.delete}
          </div>{' '}
        </Tooltip>}
    </div>
  );
}
