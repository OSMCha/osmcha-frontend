// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesets} from '../store/changesets_page_actions';
import R from 'ramda';

import type {ChangesetsPageType} from '../store/changesets_page_reducer';
import type {RootStateType} from '../store';

class RangeItem extends React.PureComponent {
  render() {
    console.log(this.props);
    return (
      <button
        onClick={this._onClick}
        className={`btn btn--s ${this.props.active ? 'is-active' : ''}`}
      >
        {this.props.page}
      </button>
    );
  }
  _onClick = () => {
    this.props.fetchChangesets(this.props.page);
  };
}

class List extends React.PureComponent {
  props: {
    pathname: string,
    changesetsPage: ChangesetsPageType,
    fetchChangesets: (number) => mixed, // base 0
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesets(0);
  }
  render() {
    const currentPage = this.props.changesetsPage.get('currentPage');
    const pageIndex = this.props.changesetsPage.get('pageIndex');
    const loading = this.props.changesetsPage.get('loading');
    const error = this.props.changesetsPage.get('error');
    const base = parseInt(pageIndex / 10, 10) * 10;

    if (error) {
      return <div>error {JSON.stringify(error.stack)} </div>;
    }
    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        {loading ? <div className="loading" /> : null}
        <div className="flex-child flex-child--grow px12 scroll-auto mt12">
          <ul>
            {currentPage &&
              currentPage.features.map((f, k) => <div key={k}>{f.id}</div>)}
          </ul>
        </div>
        <footer className="p12 bg-gray-faint txt-s">
          {R.range(base, base + 10).map(n => (
            <RangeItem
              key={n}
              page={n}
              active={n === pageIndex}
              fetchChangesets={this.props.fetchChangesets}
            />
          ))}
        </footer>
      </div>
    );
  }
}

List = connect(
  (state: RootStateType) => ({
    pathname: state.routing.location.pathname,
    changesetsPage: state.changesetsPage,
  }),
  {fetchChangesets},
)(List);
export {List};
