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
import { osmAuthUrl } from '../config/constants';

import { createPopup } from '../utils/create_popup';
import { handlePopupCallback } from '../utils/handle_popup_callback';

import {
  getOAuthToken,
  getFinalToken,
  logUserOut
} from '../store/auth_actions';

import type { RootStateType } from '../store';

class NavbarSidebar extends React.PureComponent {
  props: {
    changesetId: number,
    location: Object,
    avatar: ?string,
    currentChangeset: Map<string, *>,
    username: ?string,
    token: ?string,
    oAuthToken: ?string,
    getOAuthToken: () => mixed,
    getFinalToken: () => mixed,
    logUserOut: () => mixed
  };
  state = {
    isMenuOpen: false
  };
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
  openMenu = () => {
    // onClick={this.props.logUserOut}
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  };
  displayDropdown = () => {
    return (
      <div>
        <Avatar url={this.props.avatar} />
        <div> {this.props.username}</div>
        <Button onClick={this.props.logUserOut} className="bg-white-on-hover">
          Logout
        </Button>
      </div>
    );
  };
  render() {
    return (
      <div>
        <Navbar
          className="bg-white border-b border--gray-light border--1"
          title={
            <span className="txt-fancy color-gray txt-xl">
              <span className="color-green txt-bold">
                OSM
              </span>
              Cha
            </span>
          }
          buttons={
            <div>
              {this.props.token
                ? <div className="dropdown mr3 pointer">
                    <span onClick={this.openMenu}>
                      <span className="btn btn--s bg-white color-gray border border--gray round">
                        <span>{this.props.username}</span>
                        <svg className="icon inline-block align-middle ">
                          <use xlinkHref="#icon-chevron-down" />
                        </svg>
                      </span>
                    </span>
                    <div
                      className="dropdown-content w240 z6 round p12"
                      style={{
                        display: this.state.isMenuOpen ? 'block' : 'none',
                        marginLeft: -90,
                        marginTop: 10
                      }}
                    >
                      {this.displayDropdown()}
                    </div>
                  </div>
                : <Button
                    onClick={this.handleLoginClick}
                    disable={!this.props.oAuthToken}
                  >
                    Sign In
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
    location: props.location,
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
