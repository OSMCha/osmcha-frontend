// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesetsPage} from '../store/changesets_page_actions';
import {fetchChangeset} from '../store/changeset_actions';

import R from 'ramda';
import {List} from '../components/list';
import type {ChangesetsPageType} from '../store/changesets_page_reducer';
import type {RootStateType} from '../store';

class RangeItem extends React.PureComponent {
  render() {
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
    this.props.fetchChangesetsPage(this.props.page);
  };
}

class ChangesetsList extends React.PureComponent {
  props: {
    pathname: string,
    changesetsPage: ChangesetsPageType,
    fetchChangesetsPage: (number) => mixed, // base 0
    fetchChangeset: (number) => mixed, // base 0
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesetsPage(0);
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
              <List
                changesets={currentPage.features}
                fetchChangeset={this.props.fetchChangeset}
              />}
          </ul>
        </div>
        <footer className="p12 bg-gray-faint txt-s">
          {R.range(base, base + 10).map(n => (
            <RangeItem
              key={n}
              page={n}
              active={n === pageIndex}
              fetchChangesetsPage={this.props.fetchChangesetsPage}
            />
          ))}
        </footer>
      </div>
    );
  }
}

ChangesetsList = connect(
  (state: RootStateType) => ({
    pathname: state.routing.location.pathname,
    changesetsPage: state.changesetsPage,
  }),
  {
    fetchChangesetsPage,
    fetchChangeset,
  },
)(ChangesetsList);
export {ChangesetsList};
