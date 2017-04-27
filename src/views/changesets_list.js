// @flow
import React from 'react';
import {connect} from 'react-redux';
import {List as ImmutableList, Map} from 'immutable';
import R from 'ramda';
import Mousetrap from 'mousetrap';
import {history} from '../store';
import {fetchChangeset} from '../store/changeset_actions';
import {fetchChangesetsPage} from '../store/changesets_page_actions';
import {List} from '../components/list';
import {Loading} from '../components/loading';
import {NEXT_CHANGESET, PREV_CHANGESET} from '../config/bindings';

import type {RootStateType} from '../store';
import type {ChangesetType} from '../store/changeset_reducer';
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
    cachedChangesets: Map<string, *>,
    pageIndex: number,
    fetchChangesetsPage: (number) => mixed, // base 0
    fetchChangeset: (number) => mixed, // base 0
    activeChangesetId: ?number,
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesetsPage(0);
  }
  goUpDownToChangeset = (direction: number) => {
    let features = this.props.currentPage.get('features');
    if (features) {
      let index = features.findIndex(
        f => f.get('id') === this.props.activeChangesetId,
      );
      index += direction;
      const nextFeature = features.get(index);
      if (nextFeature) {
        history.push(`/changesets/${nextFeature.get('id')}`);
      }
    }
  };
  componentDidMount() {
    Mousetrap.bind(NEXT_CHANGESET, e => {
      e.preventDefault();
      this.goUpDownToChangeset(1);
    });
    Mousetrap.bind(PREV_CHANGESET, e => {
      e.preventDefault();
      this.goUpDownToChangeset(-1);
    });
  }
  showList = () => {
    const currentPage = this.props.currentPage;
    if (!currentPage) return null;
    const features: ImmutableList<Map<string, *>> = currentPage.get('features');
    return (
      <List
        activeChangesetId={this.props.activeChangesetId}
        data={features}
        cachedChangesets={this.props.cachedChangesets}
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
    if (loading) {
      return <Loading />;
    }
    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        <div className="flex-child flex-child--grow scroll-auto mt3">
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
  (state: RootStateType, props) => ({
    routing: state.routing,
    pathname: state.routing.location.pathname,
    currentPage: state.changesetsPage.get('currentPage'),
    pageIndex: state.changesetsPage.get('pageIndex'),
    loading: state.changesetsPage.get('loading'),
    error: state.changesetsPage.get('error'),
    cachedChangesets: state.changeset.get('changesets'),
    activeChangesetId: state.changeset.get('changesetId'),
  }),
  {
    fetchChangesetsPage,
    fetchChangeset,
  },
)(ChangesetsList);
export {ChangesetsList};
