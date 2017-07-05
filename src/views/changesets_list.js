// @flow
import React from 'react';
import { connect } from 'react-redux';
import { is, List as ImmutableList, Map, fromJS } from 'immutable';
import { push } from 'react-router-redux';
import type { RootStateType } from '../store';

import {
  getChangesetsPage,
  applyFilters
} from '../store/changesets_page_actions';

import { List } from '../components/list';
import { Footer } from '../components/list/footer';
import { Header } from '../components/list/header';
import { keyboardToggleEnhancer } from '../components/keyboard_enhancer';

import {
  NEXT_CHANGESET,
  PREV_CHANGESET,
  FILTER_BINDING
} from '../config/bindings';

window.Map = Map;
class ChangesetsList extends React.PureComponent {
  props: {
    location: Object,
    loading: boolean,
    error: Object,
    currentPage: ?Map<string, *>,
    diff: number,
    diffLoading: boolean,
    pageIndex: number,
    activeChangesetId: ?number,
    filters: Map<string, ImmutableList<*>>,
    lastKeyStroke: Map<string, *>,
    getChangesetsPage: (number, ?boolean) => mixed, // base 0
    push: Object => mixed,
    applyFilters: (Map<string, ImmutableList<*>>) => mixed // base 0
  };
  maxPageCount = Infinity;
  constructor(props) {
    super(props);
    this.props.getChangesetsPage(props.pageIndex);
  }

  goUpDownToChangeset = (direction: number) => {
    if (!this.props.currentPage) return;
    let features = this.props.currentPage.get('features');
    if (features) {
      let index = features.findIndex(
        f => f.get('id') === this.props.activeChangesetId
      );
      index += direction;
      const nextFeature = features.get(index);
      if (nextFeature) {
        const location = {
          ...this.props.location, //  clone it
          pathname: `/changesets/${nextFeature.get('id')}`
        };
        this.props.push(location);
      }
    }
  };
  toggleFilters() {
    if (this.props.location && this.props.location.pathname === '/filters') {
      const location = {
        ...this.props.location, //  clone it
        pathname: '/'
      };
      this.props.push(location);
    } else {
      const location = {
        ...this.props.location, //  clone it
        pathname: '/filters'
      };
      this.props.push(location);
    }
  }
  componentWillReceiveProps(nextProps) {
    const lastKeyStroke: Map<string, *> = nextProps.lastKeyStroke;
    if (is(this.props.lastKeyStroke, lastKeyStroke)) return;
    switch (lastKeyStroke.keySeq().first()) {
      case FILTER_BINDING.label: {
        this.toggleFilters();
        break;
      }
      case NEXT_CHANGESET.label: {
        this.goUpDownToChangeset(1);
        break;
      }
      case PREV_CHANGESET.label: {
        this.goUpDownToChangeset(-1);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleFilterOrderBy = (selected: Array<*>) => {
    let mergedFilters;
    mergedFilters = this.props.filters.set('order_by', fromJS(selected));
    this.props.applyFilters(mergedFilters);
  };

  reloadCurrentPage = () => {
    this.props.getChangesetsPage(this.props.pageIndex, true);
  };

  render() {
    const {
      filters,
      currentPage,
      loading,
      location,
      diff,
      diffLoading,
      activeChangesetId,
      pageIndex,
      getChangesetsPage
    } = this.props;
    return (
      <div
        className={`flex-parent flex-parent--column changesets-list bg-white`}
      >
        <Header
          filters={filters}
          handleFilterOrderBy={this.handleFilterOrderBy}
          location={location}
          currentPage={currentPage}
          diff={diff}
          diffLoading={diffLoading}
          reloadCurrentPage={this.reloadCurrentPage}
        />
        <List
          activeChangesetId={activeChangesetId}
          loading={loading}
          currentPage={currentPage}
          pageIndex={pageIndex}
        />
        <Footer
          pageIndex={pageIndex}
          getChangesetsPage={getChangesetsPage}
          count={currentPage && currentPage.get('count')}
        />
      </div>
    );
  }
}

ChangesetsList = keyboardToggleEnhancer(
  false,
  [NEXT_CHANGESET, PREV_CHANGESET, FILTER_BINDING],
  ChangesetsList
);

ChangesetsList = connect(
  (state: RootStateType, props) => ({
    location: state.routing.location,
    loading: state.changesetsPage.get('loading'),
    error: state.changesetsPage.get('error'),
    currentPage: state.changesetsPage.get('currentPage'),
    diff: state.changesetsPage.get('diff'),
    diffLoading: state.changesetsPage.get('diffLoading'),
    pageIndex: state.changesetsPage.get('pageIndex') || 0,
    activeChangesetId: state.changeset.get('changesetId'),
    filters: state.changesetsPage.get('filters') || Map()
  }),
  {
    // actions
    getChangesetsPage,
    applyFilters,
    push
  }
)(ChangesetsList);
export { ChangesetsList };
