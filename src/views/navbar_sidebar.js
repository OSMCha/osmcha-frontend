// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import { Tags } from '../components/changeset/tags';
import { Button } from '../components/button';
import { Navbar } from '../components/navbar';
import { Verify } from '../components/changeset/verify';
import { Dropdown } from '../components/dropdown';
import { OpenIn } from '../components/changeset/open_in';
import { Avatar } from '../components/avatar';

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
    logUserOut: () => mixed
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
      const popup = createPopup('oauth_popup', url);
      handlePopupCallback().then(oAuthObj => {
        this.props.getFinalToken(oAuthObj.oauth_verifier);
      });
    }
  };
  openMenu = () => {
    // onClick={this.props.logUserOut}
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  };
  displayDropdown = () => {
    return (
      <div className="flex-parent flex-parent--column align-items--center justify--space-between">
        <div className="mb12">
          <Avatar size={72} url={this.props.avatar} />
          <div className="txt txt-bold color-gray align-center">
            {this.props.username}
          </div>
        </div>
        <Button onClick={this.props.logUserOut} className="bg-white-on-hover">
          Logout
        </Button>
      </div>
    );
  };
  render() {
    let username = this.props.username;
    console.log(this.props.location);
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
              {this.props.token
                ? <div className="mr3 pointer">
                    <Link
                      className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                      to={{
                        ...this.props.location,
                        pathname: '/user'
                      }}
                    >
                      {username && username.length > 10
                        ? `${username.slice(0, 10)}..`
                        : username}
                    </Link>
                  </div>
                : <Button
                    onClick={this.handleLoginClick}
                    disable={!this.props.oAuthToken}
                    iconName="osm"
                  >
                    Sign in
                  </Button>}
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
    logUserOut
  }
)(NavbarSidebar);

export { NavbarSidebar };
