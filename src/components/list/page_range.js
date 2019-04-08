// @flow
import React from 'react';

export class PageRange extends React.PureComponent {
  render() {
    return (
      <button
        onClick={this._onClick}
        disabled={this.props.disabled}
        className={`flex-child btn btn--s color-gray round bg-gray-faint bg-darken10-on-active bg-darken5-on-hover
          ${this.props.active && 'is-active '}
          `}
      >
        {typeof this.props.page === 'number' ? (
          this.props.page + 1
        ) : (
          <svg className="icon icon--s inline-block align-middle ">
            <use xlinkHref={`#icon-${this.props.page}`} />
          </svg>
        )}
      </button>
    );
  }
  _onClick = () => {
    this.props.getChangesetsPage(this.props.pageIndex);
  };
}
