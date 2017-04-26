// @flow
import React, {Element} from 'react';

export class ListItemMulti extends React.PureComponent {
  props: {
    left: ?Element<*>,
    title: ?Element<*>,
    minor: ?Element<*>,
    secondary: ?Element<*>,
    right: ?Element<*>,
    className: ?string,
    active: ?boolean,
  };
  render() {
    const {
      className,
      minor,
      left,
      title,
      secondary,
      right,
      active,
      ...other
    } = this.props;
    return (
      <div
        className={
          `${active ? 'bg-green-faint bg-green-faint-on-hover' : ' bg-gray-faint-on-hover '} transition  ${className || ''}`
        }
      >
        <div
          {...other}
          className={
            `ml6 cursor-pointer flex-parent flex-parent--row justify--space-between border-b py6 border-b--1 border--gray-light`
          }
        >
          <div className="flex-parent flex-parent--row">
            <div>{left}</div>
            <div className="flex-parent flex-parent--column">
              <div>{title}</div>
              <div>{secondary}</div>
              <div>{minor}</div>
            </div>
          </div>
          <div>{right}</div>
        </div>
      </div>
    );
  }
}
