// @flow
import React from 'react';
import { connect } from 'react-redux';
import { List as ImmutableList, Map } from 'immutable';
import R from 'ramda';
import Mousetrap from 'mousetrap';

import type { RootStateType } from '../store';
import type { ChangesetType } from '../store/changeset_reducer';

import { history } from '../store';
import { getChangeset } from '../store/changeset_actions';
import { getChangesetsPage } from '../store/changesets_page_actions';
import {
  getOAuthToken,
  getFinalToken,
  logUserOut
} from '../store/auth_actions';

import { List } from '../components/list';
import { Button } from '../components/button';
import { PageRange } from '../components/list/page_range';

import { NEXT_CHANGESET, PREV_CHANGESET } from '../config/bindings';
import { osmAuthUrl } from '../config/constants';
import { createPopup } from '../utils/create_popup';
import { handlePopupCallback } from '../utils/handle_popup_callback';
const RANGE = 6;

class ChangesetsList extends React.PureComponent {
  props: {
    pathname: string,
    loading: boolean,
    error: Object,
    style: Object,
    currentPage: Map<string, *>,
    cachedChangesets: Map<string, *>,
    userDetails: Map<string, *>,
    pageIndex: number,
    getChangesetsPage: number => mixed, // base 0
    getChangeset: number => mixed, // base 0
    getOAuthToken: () => mixed,
    getFinalToken: () => mixed,
    logUserOut: () => mixed,
    activeChangesetId: ?number,
    oAuthToken: ?string,
    token: ?string
  };
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
        console.log('popupgave', oAuthObj);
        this.props.getFinalToken(oAuthObj.oauth_verifier);
      });
    }
  };

  render() {
    const { error } = this.props;
    if (error) {
      return <div>error {JSON.stringify(error.stack)} </div>;
    }
    const base = parseInt(this.props.pageIndex / RANGE, 10) * RANGE;
    const { currentPage, loading } = this.props;

    return (
      <div
        className={`flex-parent flex-parent--column changesets-list ${window.innerWidth < 800 ? 'viewport-full' : ''}`}
      >
        <header className="hmin55 h55 p12 pb24 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          {this.props.userDetails &&
            <span> Hi, {this.props.userDetails.get('username')}</span>}
          {this.props.token
            ? <Button onClick={this.props.logUserOut}>
                Logout
              </Button>
            : <Button
                onClick={this.handleLoginClick}
                disable={!this.props.oAuthToken}
              >
                Auth
              </Button>}
        </header>
        <List
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
            active={false}
            getChangesetsPage={this.props.getChangesetsPage}
          />
          {R.range(base, base + RANGE).map(n => (
            <PageRange
              key={n}
              page={n}
              pageIndex={n}
              active={n === this.props.pageIndex}
              getChangesetsPage={this.props.getChangesetsPage}
            />
          ))}
          <PageRange
            page={'>'}
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
    pathname: state.routing.location.pathname,
    currentPage: state.changesetsPage.getIn([
      'pages',
      state.changesetsPage.get('pageIndex')
    ]),
    pageIndex: state.changesetsPage.get('pageIndex') || 0,
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
    logUserOut
  }
)(ChangesetsList);
export { ChangesetsList };
