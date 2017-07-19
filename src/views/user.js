// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, fromJS, List } from 'immutable';
import { push } from 'react-router-redux';

import Mousetrap from 'mousetrap';

import { Changeset as ChangesetDumb } from '../components/changeset';
import { getUserDetails } from '../network/openstreetmap';
import {
  fetchBlackList,
  postUserToBlackList,
  deleteFromBlackList
} from '../network/osmcha_blacklist';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { cancelablePromise } from '../utils/promise';
import { fetchAllAOIs } from '../network/aoi';
import { Link } from 'react-router-dom';
import { createAOI, deleteAOI } from '../network/aoi';
import type { filterType, filtersType } from '../components/filters';
import { modal } from '../store/modal_actions';
import { dispatchEvent } from '../utils/dispatch_event';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import { logUserOut } from '../store/auth_actions';
import { applyFilters } from '../store/filters_actions';
import { FILTER_BY_USER } from '../config/bindings';
import type { RootStateType } from '../store';
const BlockMarkup = ({ children }) =>
  <div className="flex-child flex-child--grow bg-gray-faint mx12 round p12 my6">
    <div className="flex-parent flex-parent--row  justify--space-between">
      {children}
    </div>
  </div>;

class SaveButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  ref;
  clicked = false;
  onClick = event => {
    this.clicked = true;
    this.setState({ editing: true });
  };
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  onKeyDown = event => {
    if (event.keyCode === 13) {
      this.setState({
        editing: false
      });
      this.props.onCreate(this.state.value);
    } else if (event.keyCode === 27) {
      this.setState({
        editing: false
      });
      this.clicked = false;
    }
  };
  render() {
    return (
      <span>
        {this.state.editing
          ? <span className="flex-parent flex-parent--row ">
              <input
                className="input wmax120 ml12"
                ref={r => {
                  if (this.clicked) {
                    r && r.select();
                    this.clicked = false;
                  }
                }}
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
              />
              <Button className="input wmax120 ml6" onClick={this.onClick}>
                Save
              </Button>
            </span>
          : <Button className="input wmax120 ml12" onClick={this.onClick}>
              Add+
            </Button>}
      </span>
    );
  }
}
const BlackListBlock = ({ data, removeFromBlackList }) =>
  <BlockMarkup>
    <span>
      <span>
        {data.getIn(['username'])}
      </span>
      <span className="txt-em color-gray pl6">
        ({data.getIn(['date'])})
      </span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: `aoi=${data.getIn(['id'])}`,
          pathname: '/filters'
        }}
      >
        OSMCha
      </Link>
      <Button
        className="mr3"
        onClick={() => removeFromBlackList(data.getIn(['username']))}
      >
        Remove
      </Button>
    </span>
  </BlockMarkup>;
const AOIsBlock = ({ data, activeAoiId, removeAoi }) =>
  <BlockMarkup>
    <span>
      <span
        className={`${activeAoiId === data.getIn(['id']) ? 'txt-bold' : ''}`}
      >
        {data.getIn(['properties', 'name'])}
        {activeAoiId === data.getIn(['id']) ? '*' : ''}
      </span>
      <span className="txt-em color-gray pl6">
        ({data.getIn(['id'])})
      </span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: `aoi=${data.getIn(['id'])}`,
          pathname: '/filters'
        }}
      >
        {activeAoiId === data.getIn(['id']) ? 'Active' : 'Load'}
      </Link>
      <Button className="mr3" onClick={() => removeAoi(data.getIn(['id']))}>
        Remove
      </Button>
    </span>
  </BlockMarkup>;

const ListFortified = ({
  onAdd,
  onRemove,
  data,
  TargetBlock,
  propsToPass,
  SaveComp
}) =>
  <div>
    {data.map((e, i) => <TargetBlock key={i} data={e} {...propsToPass} />)}
    {SaveComp}
  </div>;

type propsType = {
  avatar: ?string,
  aoiId: ?string,
  token: string,
  data: Map<string, any>,
  location: Object,
  filters: filtersType,
  userDetails: Map<string, any>,
  applyFilters: (filtersType, path?: string) => mixed, // base
  reloadData: () => any,
  logUserOut: () => any,
  push: any => any,
  modal: any => any
};

class User extends React.PureComponent<any, propsType, any> {
  createAOIPromise;
  addToBlackListPromise;
  deleteFromBlackListPromise;
  // componentDidMount() {
  //   // Mousetrap.bind(FILTER_BY_USER.bindings, this.filterChangesetsByUser);
  // }
  componentWillUnmount() {
    this.createAOIPromise && this.createAOIPromise.cancel();
    this.addToBlackListPromise && this.addToBlackListPromise.cancel();
    // FILTER_BY_USER.bindings.forEach(k => Mousetrap.unbind(k));
  }
  // blacklist
  addToBlackList = (username: string) => {
    this.addToBlackListPromise = cancelablePromise(
      postUserToBlackList(this.props.token, username)
    );

    this.addToBlackListPromise.promise
      .then(r => {
        this.props.modal({
          kind: 'success',
          title: 'User Added',
          description: `The user ${username} was added to your blacklist`
        });
        this.props.reloadData();
      })
      .catch(e => {
        this.props.modal({
          kind: 'error',
          title: 'Adding failed ',
          error: e
        });
        this.props.reloadData();
      });
  };
  removeFromBlackList = (username: string) => {
    if (!username) return;
    this.deleteFromBlackListPromise = cancelablePromise(
      deleteFromBlackList(this.props.token, username)
    );
    this.deleteFromBlackListPromise.promise
      .then(r => {
        this.props.modal({
          kind: 'success',
          title: 'User Removed ',
          description: `The user ${username} was removed from your blacklist`
        });
        this.props.reloadData();
      })
      .catch(e => {
        console.error(e);
        this.props.modal({
          kind: 'error',
          title: 'Removing failed ',
          error: e
        });
      });
  };
  // aoi
  loadAoiId = (aoiId: ?string) => {
    if (!aoiId) return;
    this.props.push({
      ...this.props.location,
      search: `aoi=${aoiId}`,
      path: '/filters'
    });
  };
  createAOI = (name: string) => {
    if (name === '' || !name) return;
    this.createAOIPromise = cancelablePromise(
      createAOI(this.props.token, name, this.props.filters)
    );

    this.createAOIPromise.promise
      .then(r => r && this.loadAoiId(r.id))
      .catch(e => console.error(e));
  };
  removeAOI = (aoiId: string) => {
    if (!aoiId) return;
    deleteAOI(this.props.token, aoiId)
      .then(r => {
        if (aoiId === this.props.aoiId) {
          this.props.applyFilters(new Map(), '/user');
        } else {
          const location = {
            ...this.props.location, //  clone it
            pathname: '/user'
          };
          this.props.reloadData();
        }
        this.props.modal({
          kind: 'success',
          title: 'Filter Deleted ',
          description: `The ${aoiId} was deleted`
        });
      })
      .catch(e => {
        this.props.reloadData();
        this.props.modal({
          kind: 'error',
          title: 'Deletion failed ',
          error: e
        });
      });
  };
  render() {
    const userDetails = this.props.userDetails;
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white ${window.innerWidth <
        800
          ? 'viewport-full'
          : ''}`}
      >
        <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l txt-bold color-gray--dark">
            <span>User</span>
          </span>
          <span className="txt-l color-gray--dark" />
        </header>
        <div className="px30 flex-child filters-scroll">
          <span className="flex-parent flex-parent--row align justify--space-between  mr6 txt-bold mt24">
            <Avatar size={72} url={this.props.avatar} />
            <span
              className="flex-child flex-child--grow pl24  pt18"
              style={{ alignSelf: 'center' }}
            >
              <h2 className="txt-xl">
                Welcome {userDetails.get('username')}!
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
              <p className="flex-child">
                {userDetails.get('id')}
              </p>
            </span>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">OSM ID: </p>
              <p className="flex-child">
                {userDetails.get('uid')}
              </p>
            </span>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Username: </p>
              <p className="flex-child">
                {userDetails.get('username')}
              </p>
            </span>

            {userDetails.get('is_staff') &&
              <span className="ml12 flex-parent flex-parent--row my3">
                <p className="flex-child txt-bold w120">Staff: </p>
                <p className="flex-child">
                  {userDetails.get('is_staff')}
                </p>
              </span>}
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Active: </p>
              <p className="flex-child">
                {userDetails.get('is_active')}
              </p>
            </span>
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Email: </p>
              <p className="flex-child">
                {userDetails.get('email')}
              </p>
            </span>

            <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
              BlackList
            </h2>
            <ListFortified
              data={this.props.data.getIn(['blackList'], List())}
              TargetBlock={BlackListBlock}
              propsToPass={{
                removeFromBlackList: this.removeFromBlackList
              }}
              SaveComp={<SaveButton onCreate={this.addToBlackList} />}
            />
            <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
              <span className="txt-bold">Saved Filters</span>
              <span className="txt-xs txt-em">(Experimental)</span>
            </h2>
            <ListFortified
              data={this.props.data.getIn(['aoi', 'features'], List())}
              TargetBlock={AOIsBlock}
              propsToPass={{
                activeAoiId: this.props.aoiId,
                removeAoi: this.removeAOI
              }}
              SaveComp={<SaveButton onCreate={this.createAOI} />}
            />
            <Button
              onClick={this.props.logUserOut}
              className="mt12 mx12 bg-white-on-hover"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
/**
 * Never use props not required by the Basecomponent in HOCs
 */
User = withFetchDataSilent(
  (props: propsType) => ({
    blackList: cancelablePromise(fetchBlackList(props.token)),
    aoi: cancelablePromise(fetchAllAOIs(props.token))
  }),
  (nextProps: propsType, props: propsType) => true,
  User
);

User = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    filters: state.filters.get('filters'),

    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ]),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar']),
    aoiId: state.filters.getIn(['aoi', 'id'], null)
  }),
  {
    applyFilters,
    logUserOut,
    modal,
    push
  }
)(User);

export { User };
