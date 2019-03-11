// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';

import { Button } from '../components/button';
import { Navbar } from '../components/navbar';
import { Dropdown } from '../components/dropdown';

import { createPopup } from '../utils/create_popup';
import { handlePopupCallback } from '../utils/handle_popup_callback';
import { osmAuthUrl } from '../config/constants';
import { appVersion, isDev, isStaging, isLocal } from '../config';

import {
  getOAuthToken,
  getFinalToken,
  logUserOut
} from '../store/auth_actions';

import type { RootStateType } from '../store';

class NavbarSidebar extends React.PureComponent {
  props: {
    changesetId: ?number,
    location: Object,
    avatar: ?string,
    currentChangeset: Map<string, *>,
    username: ?string,
    token: ?string,
    oAuthToken: ?string,
    getOAuthToken: () => mixed,
    getFinalToken: string => mixed,
    logUserOut: () => mixed,
    push: any => any
  };
  state = {
    isMenuOpen: false
  };

  handleLoginClick = () => {
    var oAuthToken = this.props.oAuthToken;
    if (!oAuthToken) return;
    let url = `${osmAuthUrl}?oauth_token=${oAuthToken}`;
    if (isDev || isLocal) {
      url = '/local-landing.html';
    }

    if (oAuthToken) {
      createPopup('oauth_popup', url);
      handlePopupCallback().then(oAuthObj => {
        this.props.getFinalToken(oAuthObj.oauth_verifier);
      });
    }
  };
  onUserMenuSelect = (arr: Array<Object>) => {
    if (arr.length === 1) {
      if (arr[0].url === '/logout') {
        this.props.logUserOut();
      } else {
        console.log(this.props.push);
        this.props.push({
          ...this.props.location,
          search: this.props.location.search,
          pathname: arr[0].url
        });
      }
    } else if (arr.length > 1) {
      throw new Error('filter select array is big');
    }
  };
  renderUserMenuOptions() {
    const username = this.props.username;

    return (
      <Dropdown
        display={username ? username.slice(0, 10) : 'User'}
        options={[
          { label: 'Account settings', url: '/user' },
          { label: 'My saved filters', url: '/saved-filters' },
          { label: 'My teams', url: '/teams' },
          { label: 'My trusted users list', url: '/trusted-users' },
          { label: 'My watchlist', url: '/watchlist' },
          { label: 'Logout', url: '/logout' }
        ]}
        onChange={this.onUserMenuSelect}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
      />
    );
  }
  openMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  };
  render() {
    return (
      <div>
        <Navbar
          className="navbar-logo bg-gray-faint border-b border--gray-light border--1"
          title={
            <span className="color-gray">
              <Link
                to={{
                  search: window.location.search,
                  pathname: '/'
                }}
              >
                <span className="txt-xl">
                  <span className="color-blue txt-bold">OSM</span>
                  Cha
                </span>
              </Link>
              <span className="relative">
                <span
                  className="txt-xs txt-mono absolute w72"
                  style={{ top: 17, left: -118 }}
                >
                  v{appVersion}
                  {isDev && ' Dev'}
                  {isLocal && ' Local'}
                  {isStaging && ' Staging'}
                </span>
              </span>
            </span>
          }
          buttons={
            <div className="flex-parent flex-parent--row">
              <Link
                className="pr3 pointer"
                to={{
                  search: window.location.search,
                  pathname: '/about'
                }}
              >
                <svg className="icon icon--m inline-block align-middle color-darken25 color-darken50-on-hover transition">
                  <use xlinkHref="#icon-question" />
                </svg>
              </Link>
              {this.props.token ? (
                <div className="mr3 pointer">
                  {this.renderUserMenuOptions()}
                </div>
              ) : (
                <Button
                  onClick={this.handleLoginClick}
                  disable={!this.props.oAuthToken}
                  iconName="osm"
                >
                  Sign in
                </Button>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

NavbarSidebar = connect(
  (state: RootStateType, props) => ({
    location: state.routing.location,
    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ]),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    username: state.auth.getIn(['userDetails', 'username']),
    avatar: state.auth.getIn(['userDetails', 'avatar'])
  }),
  {
    getOAuthToken,
    getFinalToken,
    logUserOut,
    push
  }
)(NavbarSidebar);

export { NavbarSidebar };
