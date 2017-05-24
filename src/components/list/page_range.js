// @flow
import React from 'react';

export class PageRange extends React.PureComponent {
  render() {
    return (
      <button
        onClick={this._onClick}
        disabled={this.props.page === '<' && this.props.pageIndex === -1}
        className={
          `flex-child btn btn--s  color-gray-dark 
          ${this.props.active ? 'is-active bg-gray-light' : 'bg-gray-faint'}
          `
        }
      >
        {this.props.page}
      </button>
    );
  }
  _onClick = () => {
    this.props.getChangesetsPage(this.props.pageIndex);
  };
}
