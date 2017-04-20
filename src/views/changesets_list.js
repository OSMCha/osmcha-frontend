// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesetsPage} from '../store/changesets_page_actions';
import {fetchChangeset} from '../store/changeset_actions';
import {List as ImmutableList, Map} from 'immutable';
import R from 'ramda';
import {List} from '../components/list';
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
    loading: boolean,
    error: Object,
    currentPage: Map<string, *>,
    pageIndex: number,
    fetchChangesetsPage: (number) => mixed, // base 0
    fetchChangeset: (number) => mixed, // base 0
    activeChangesetId: ?number,
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesetsPage(0);
  }
  showList = () => {
    const currentPage = this.props.currentPage;
    if (!currentPage) return null;
    const features: ImmutableList<Map<string, *>> = currentPage.get('features');
    return (
      <List
        activeChangesetId={this.props.activeChangesetId}
        changesets={features}
        fetchChangeset={this.props.fetchChangeset}
      />
    );
  };
  showFooter = () => {
    const base = parseInt(this.props.pageIndex / 10, 10) * 10;
    return R.range(base, base + 10).map(n => (
      <RangeItem
        key={n}
        page={n}
        active={n === this.props.pageIndex}
        fetchChangesetsPage={this.props.fetchChangesetsPage}
      />
    ));
  };
  render() {
    const {loading, error} = this.props;
    if (error) {
      return <div>error {JSON.stringify(error.stack)} </div>;
    }
    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        {loading ? <div className="loading" /> : null}
        <div className="flex-child flex-child--grow px12 scroll-auto mt12">
          {this.showList()}
        </div>
        <footer className="p12 bg-gray-faint txt-s">
          {this.showFooter()}
        </footer>
      </div>
    );
  }
}

ChangesetsList = connect(
  (state: RootStateType) => ({
    pathname: state.routing.location.pathname,
    activeChangesetId: state.changeset.get('changesetId'),
    currentPage: state.changesetsPage.get('currentPage'),
    pageIndex: state.changesetsPage.get('pageIndex'),
    loading: state.changesetsPage.get('loading'),
    error: state.changesetsPage.get('error'),
  }),
  {
    fetchChangesetsPage,
    fetchChangeset,
  },
)(ChangesetsList);
export {ChangesetsList};
