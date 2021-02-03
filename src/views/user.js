// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { push } from 'react-router-redux';

import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import type { filtersType } from '../components/filters';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import { EditUserDetails } from '../components/user/details';
import type { RootStateType } from '../store';

type propsType = {
  avatar: ?string,
  token: string,
  data: Map<string, any>,
  location: Object,
  filters: filtersType,
  userDetails: Map<string, any>,
  reloadData: () => any,
  logUserOut: () => any,
  push: any => any,
  modal: any => any
};
class User extends React.PureComponent<any, propsType, any> {
  state = {
    userValues: null
  };
  onUserChange = (value: ?Array<Object>) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value
    });
  };
  render() {
    const userDetails = this.props.userDetails;
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white${
          window.innerWidth < 800 ? 'viewport-full' : ''
        }`}
      >
        <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l txt-bold color-gray--dark">
            <span>Account Settings</span>
          </span>

          <span className="txt-l color-gray--dark">
            <Button
              onClick={this.props.logUserOut}
              className="bg-white-on-hover"
            >
              Logout
            </Button>
          </span>
        </header>
        <div className="px30 flex-child  pb60  filters-scroll">
          <span className="flex-parent flex-parent--row align justify--space-between  mr6 txt-bold mt24">
            <Avatar size={72} url={this.props.avatar} />
            <span
              className="flex-child flex-child--grow pl24  pt18"
              style={{ alignSelf: 'center' }}
            >
              <h2 className="txt-xl">
                Welcome,{' '}
                {userDetails.get('username')
                  ? userDetails.get('username')
                  : 'stranger'}
                !
              </h2>
              <div className="flex-child flex-child--grow">&nbsp;</div>
            </span>
          </span>
          <div className="flex-parent flex-parent--column align justify--space-between">
            <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
              Info
            </h2>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">OSMCha ID: </p>
              <p className="flex-child">{userDetails.get('id')}</p>
            </span>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">OSM ID: </p>
              <p className="flex-child">{userDetails.get('uid')}</p>
            </span>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Username: </p>
              <p className="flex-child">{userDetails.get('username')}</p>
            </span>
            {userDetails.get('is_staff') && (
              <span className="ml12 flex-parent flex-parent--row my3">
                <p className="flex-child txt-bold w120">Staff: </p>
                <p className="flex-child">Yes</p>
              </span>
            )}
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">API key: </p>
              <p className="flex-child">
                <span className="pre pb6 pt6">Token {this.props.token}</span>
                <div
                  className="txt--s pl6 pointer inline"
                  onClick={e =>
                    navigator.clipboard.writeText(`Token ${this.props.token}`)
                  }
                  title="Copy Authorization Token"
                >
                  <svg className="icon icon--m mt-neg3 inline-block align-middle color-darken25 color-darken50-on-hover transition">
                    <use xlinkHref="#icon-clipboard" />
                  </svg>
                </div>
              </p>
            </span>

            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                    Review Comments Template
                  </h2>
                  <EditUserDetails />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

User = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ]),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar'])
  }),
  {
    logUserOut,
    modal,
    push
  }
)(User);

export { User };
