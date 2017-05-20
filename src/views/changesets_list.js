// @flow
import React from 'react';
import {connect} from 'react-redux';
import {List as ImmutableList, Map} from 'immutable';
import R from 'ramda';
import Mousetrap from 'mousetrap';

import {history} from '../store';
import {fetchChangeset} from '../store/changeset_actions';
import {fetchChangesetsPage} from '../store/changesets_page_actions';
import {initOSMChaOAuthToken, initFinalToken} from '../store/auth_actions';

import type {RootStateType} from '../store';
import type {ChangesetType} from '../store/changeset_reducer';

import {List} from '../components/list';
import {Button} from '../components/button';

import {osmchaSocialTokenUrl} from '../config/constants';
import {NEXT_CHANGESET, PREV_CHANGESET} from '../config/bindings';
import {osmAuthUrl} from '../config/constants';
import {createPopup} from '../utils/create_popup';
import {handlePopupCallback} from '../utils/handle_popup_callback';

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
    initOSMChaOAuthToken: () => mixed,
    initFinalToken: () => mixed,
    activeChangesetId: ?number,
    osmChaOAuthToken: ?string,
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesetsPage(0);
    this.props.initOSMChaOAuthToken();
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
    const {currentPage, loading} = this.props;
    if (!currentPage) return null;
    const features: ImmutableList<Map<string, *>> = currentPage.get('features');
    return (
      <List
        activeChangesetId={this.props.activeChangesetId}
        data={features}
        loading={loading}
        cachedChangesets={this.props.cachedChangesets}
        fetchChangeset={this.props.fetchChangeset}
        fetchChangesetsPage={this.props.fetchChangesetsPage}
        pageIndex={this.props.pageIndex}
      />
    );
  };

  handleLoginClick = () => {
    const popup = createPopup(
      'oauth_popup',
      osmAuthUrl + this.props.osmChaOAuthToken,
    );

    handlePopupCallback().then(oAuthObj => {
      console.log('popupgave', oAuthObj);
      this.props.initFinalToken(oAuthObj);
    });
  };

  render() {
    const {error} = this.props;
    if (error) {
      return <div>error {JSON.stringify(error.stack)} </div>;
    }
    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        <div
          className="h55 p12 pb24 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-around top relative"
        >
          <Button
            onClick={this.handleLoginClick}
            disable={!this.props.osmChaOAuthToken}
          >
            Auth
          </Button>
        </div>
        {this.showList()}
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
    osmChaOAuthToken: state.auth.get('osmChaOAuthToken'),
    cachedChangesets: state.changeset.get('changesets'),
    activeChangesetId: state.changeset.get('changesetId'),
  }),
  {
    // actions
    fetchChangesetsPage,
    fetchChangeset,
    initOSMChaOAuthToken,
    initFinalToken,
  },
)(ChangesetsList);
export {ChangesetsList};
