// @flow
import React from 'react';
import { connect } from 'react-redux';
import { List as ImmutableList, Map } from 'immutable';
import R from 'ramda';
import Mousetrap from 'mousetrap';
import { NavLink } from 'react-router-dom';

import type { RootStateType } from '../store';
import type { ChangesetType } from '../store/changeset_reducer';

import { history } from '../store/history';
import { getChangeset } from '../store/changeset_actions';
import {
  getChangesetsPage,
  applyFilters
} from '../store/changesets_page_actions';
import {
  getOAuthToken,
  getFinalToken,
  logUserOut
} from '../store/auth_actions';

import { List } from '../components/list';
import { Button } from '../components/button';
import { PageRange } from '../components/list/page_range';
import { Dropdown } from '../components/dropdown';

import { NEXT_CHANGESET, PREV_CHANGESET } from '../config/bindings';
import { osmAuthUrl, PAGE_SIZE } from '../config/constants';
import { createPopup } from '../utils/create_popup';
import { handlePopupCallback } from '../utils/handle_popup_callback';

import filters from '../config/filters.json';

const RANGE = 6;

class ChangesetsList extends React.PureComponent {
  props: {
    location: Object,
    loading: boolean,
    error: Object,
    style: Object,
    currentPage: ?Map<string, *>,
    cachedChangesets: Map<string, *>,
    userDetails: Map<string, *>,
    pageIndex: number,
    activeChangesetId: ?number,
    oAuthToken: ?string,
    token: ?string,
    getChangesetsPage: number => mixed, // base 0
    getChangeset: number => mixed, // base 0
    getOAuthToken: () => mixed,
    getFinalToken: () => mixed,
    logUserOut: () => mixed,
    filters: Object,
    applyFilters: Object => mixed // base 0
  };
  maxPageCount = Infinity;
  constructor(props) {
    super(props);
    this.props.getChangesetsPage(props.pageIndex);
  }
  goUpDownToChangeset = (direction: number) => {
    let features = this.props.currentPage.get('features');
    if (features) {
      let index = features.findIndex(
        f => f.get('id') === this.props.activeChangesetId
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

  handleLoginClick = () => {
    if (this.props.oAuthToken) {
      const popup = createPopup(
        'oauth_popup',
        process.env.NODE_ENV === 'production'
          ? `${osmAuthUrl}?oauth_token=${this.props.oAuthToken}`
          : '/local-landing.html'
      );
      handlePopupCallback().then(oAuthObj => {
        this.props.getFinalToken(oAuthObj.oauth_verifier);
      });
    }
  };
  handleFilterOrderBy = (selected: Array<*>) => {
    let mergedFilters;
    if (selected.length === 0) {
      mergedFilters = {
        ...this.props.filters
      };
      delete mergedFilters['order_by'];
    } else {
      mergedFilters = {
        ...this.props.filters,
        order_by: selected[0].value
      };
    }

    this.props.applyFilters(mergedFilters);
  };

  reloadCurrentPage = () => {
    this.props.getChangesetsPage(this.props.pageIndex);
  };
  render() {
    const { error } = this.props;
    if (error) {
      return (
        <div>
          error {JSON.stringify(error.stack)}
          {' '}
        </div>
      );
    }
    const base = parseInt(this.props.pageIndex / RANGE, 10) * RANGE;

    const { currentPage, loading } = this.props;
    if (
      this.props.pageIndex === 0 &&
      currentPage &&
      !Number.isNaN(currentPage.get('count', 10))
    ) {
      const count: number = currentPage.get('count', 10);
      this.maxPageCount = Math.ceil(count / PAGE_SIZE);
    }

    const valueData = [];
    const options = filters.filter(f => f.name === 'order_by')[0].options;
    if (this.props.filters['order_by']) {
      options.forEach(o => {
        if (this.props.filters['order_by'] === o.value) {
          valueData.push(o);
        }
      });
    }
    return (
      <div
        className={`flex-parent flex-parent--column changesets-list bg-white ${window.innerWidth <
          800
          ? 'viewport-full'
          : ''}`}
      >
        <header className="px12  hmin36 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-between align-items--center">
          <Dropdown
            onAdd={() => {}}
            onRemove={() => {}}
            onChange={this.handleFilterOrderBy}
            value={valueData}
            options={filters.filter(f => f.name === 'order_by')[0].options}
            display={(valueData[0] && valueData[0].label) || 'Order by'}
          />
          <NavLink
            activeStyle={{
              fontWeight: 'bold'
            }}
            to={{
              search: this.props.location.search,
              pathname: this.props.location.pathname.indexOf('/filters') > -1
                ? '/'
                : '/filters'
            }}
          >
            <Button className="mx3">Filters</Button>
          </NavLink>
        </header>
        <List
          reloadPage={this.reloadCurrentPage}
          activeChangesetId={this.props.activeChangesetId}
          currentPage={currentPage}
          loading={loading}
          cachedChangesets={this.props.cachedChangesets}
          getChangeset={this.props.getChangeset}
          pageIndex={this.props.pageIndex}
        />
        <footer className="hmin55 p12 pb24 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          <PageRange
            page={'<'}
            pageIndex={this.props.pageIndex - 1}
            disabled={this.props.pageIndex - 1 === -1}
            active={false}
            getChangesetsPage={this.props.getChangesetsPage}
          />
          {R.range(base, Math.min(base + RANGE, this.maxPageCount)).map(n =>
            <PageRange
              key={n}
              page={n}
              pageIndex={n}
              active={n === this.props.pageIndex}
              getChangesetsPage={this.props.getChangesetsPage}
            />
          )}
          <PageRange
            page={'>'}
            disabled={this.props.pageIndex + 1 >= this.maxPageCount}
            pageIndex={this.props.pageIndex + 1}
            active={false}
            getChangesetsPage={this.props.getChangesetsPage}
          />
        </footer>

      </div>
    );
  }
}

ChangesetsList = connect(
  (state: RootStateType, props) => ({
    routing: state.routing,
    location: state.routing.location,
    currentPage: state.changesetsPage.getIn([
      'pages',
      state.changesetsPage.get('pageIndex')
    ]),
    pageIndex: state.changesetsPage.get('pageIndex') || 0,
    filters: state.changesetsPage.get('filters') || {},
    loading: state.changesetsPage.get('loading'),
    error: state.changesetsPage.get('error'),
    oAuthToken: state.auth.get('oAuthToken'),
    userDetails: state.auth.get('userDetails'),
    token: state.auth.get('token'),
    cachedChangesets: state.changeset.get('changesets'),
    activeChangesetId: state.changeset.get('changesetId')
  }),
  {
    // actions
    getChangesetsPage,
    getChangeset,
    getOAuthToken,
    getFinalToken,
    applyFilters,
    logUserOut
  }
)(ChangesetsList);
export { ChangesetsList };
