// @flow
import React from 'react';

export class SubHeader extends React.PureComponent {
  render() {
    const { className, children, ...other } = this.props;
    return (
      <div {...other} className={`${className}`}>
        {children}
      </div>
    );
  }
}
