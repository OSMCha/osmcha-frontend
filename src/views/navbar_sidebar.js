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
import { handlePopupCallback, isMobile } from '../utils';
import { BASE_PATH } from '../config'
import { osmAuthUrl } from '../config/constants';

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

  handleLoginClick = () => {
    var oAuthToken = this.props.oAuthToken;
    if (!oAuthToken) return;

    createPopup('oauth_popup', `${osmAuthUrl}?oauth_token=${oAuthToken}`);
    handlePopupCallback().then(oAuthObj => {
      this.props.getFinalToken(oAuthObj.oauth_verifier);
    });
  };

  onUserMenuSelect = (arr: Array<Object>) => {
    const username = this.props.username;

    if (arr.length === 1) {
      if (arr[0].url === `${BASE_PATH}/logout`) {
        this.props.logUserOut();
        return;
      }
      if (arr[0].url === `${BASE_PATH}/my-changesets`) {
        this.props.push({
          ...this.props.location,
          search: `filters={"users":[{"label":"${username}","value":"${username}"}],"date__gte":[{"label":"","value":""}]}`,
          pathname: `${BASE_PATH}/`
        });
        return;
      }
      if (arr[0].url === `${BASE_PATH}/my-reviews`) {
        this.props.push({
          ...this.props.location,
          search: `filters={"checked_by":[{"label":"${username}","value":"${username}"}],"date__gte":[{"label":"","value":""}]}`,
          pathname: `${BASE_PATH}/`
        });
        return;
      }
      this.props.push({
        ...this.props.location,
        search: this.props.location.search,
        pathname: arr[0].url
      });
    } else if (arr.length > 1) {
      throw new Error('filter select array is big');
    }
  };

  renderUserMenuOptions() {
    const username = this.props.username;

    return (
      <Dropdown
        display={
          username ? (
            <span className="wmax180 align-middle inline-block txt-truncate">
              {username}
            </span>
          ) : (
            'User'
          )
        }
        options={[
          { label: 'Account settings', url: `${BASE_PATH}/user` },
          {
            label: 'My changesets',
            url: `${BASE_PATH}/my-changesets`
          },
          {
            label: 'My reviews',
            url: `${BASE_PATH}/my-reviews`
          },
          { label: 'My saved filters', url: `${BASE_PATH}/saved-filters` },
          { label: 'My teams', url: `${BASE_PATH}/teams` },
          { label: 'My trusted users list', url: `${BASE_PATH}/trusted-users` },
          { label: 'My watchlist', url: `${BASE_PATH}/watchlist` },
          { label: 'Logout', url: `${BASE_PATH}/logout` }
        ]}
        onChange={this.onUserMenuSelect}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        position="right"
      />
    );
  }

  render() {
    const mobile = isMobile();

    return (
      <>
        <Navbar
          className="navbar-logo bg-gray-faint border-b border--gray-light border--1"
          title={
            <Link
              to={{
                search: window.location.search,
                pathname: `${BASE_PATH}/`
              }}
              style={mobile ? { fontSize: '1.4em' } : { fontSize: '1.7em' }}
              className="color-gray"
            >
              <strong className="color-blue">OSM</strong>
              Cha
            </Link>
          }
          buttons={
            <div className="flex-parent flex-parent--row">
              <Link
                className="pr3 pointer"
                to={{
                  search: window.location.search,
                  pathname: `${BASE_PATH}/about`
                }}
              >
                <svg className="icon icon--m inline-block align-middle color-darken25 color-darken50-on-hover transition">
                  <use xlinkHref="#icon-question" />
                </svg>
              </Link>
              {this.props.token ? (
                <div className="pointer">{this.renderUserMenuOptions()}</div>
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
      </>
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
