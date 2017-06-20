// @flow
import React from 'react';

export class PageRange extends React.PureComponent {
  render() {
    return (
      <button
        onClick={this._onClick}
        disabled={this.props.disabled}
        className={`flex-child btn btn--s color-gray-dark
          ${this.props.active ? 'is-active bg-gray-light' : 'bg-gray-faint'}
          `}
      >
        {typeof this.props.page === 'number'
          ? this.props.page + 1
          : this.props.page}
      </button>
    );
  }
  _onClick = () => {
    this.props.getChangesetsPage(this.props.pageIndex);
  };
}
