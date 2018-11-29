// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { push } from 'react-router-redux';

import { getObjAsQueryParam } from '../utils/query_params';
import { BlackListUser } from '../components/user/blacklist_user';
import { WhiteListUser } from '../components/user/whitelist_user';

import {
  addToBlacklist,
  removeFromBlacklist
} from '../store/blacklist_actions';
import {
  addToWhitelist,
  removeFromWhitelist
} from '../store/whitelist_actions';
import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { applyFilters } from '../store/filters_actions';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { cancelablePromise } from '../utils/promise';
import { fetchAllAOIs } from '../network/aoi';
import { Link } from 'react-router-dom';
import { createAOI, deleteAOI } from '../network/aoi';
import type { filtersType } from '../components/filters';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import { EditUserDetails } from '../components/user/details';
import { CustomURL } from '../components/customURL';
import { API_URL } from '../config';
import type { RootStateType } from '../store';

const BlockMarkup = ({ children }) => (
  <div className="flex-child flex-child--grow bg-gray-faint mx12 round p12 my6">
    <div className="flex-parent flex-parent--row  justify--space-between">
      {children}
    </div>
  </div>
);

class SaveUser extends React.PureComponent {
  state = {
    showInput: false
  };
  // onUserChange = (value: ?Array<Object>) => {
  //   if (Array.isArray(value) && value.length === 0)
  //     return this.setState({ userValues: null });
  //   this.setState({
  //     userValues: value
  //   });
  // };
  // onSave = () => {
  //   this.setState({
  //     showInput: false
  //   });
  //   if (this.state.userValues) {
  //     this.props.onCreate(this.state.userValues);
  //   }
  // };
  onSave = (username, uid) => {
    if (this.props.forBlacklist) {
      if (!username || !uid) return;
      this.props.onCreate({ username, uid });
      this.setState({ showInput: false });
    } else {
      if (!username) return;
      this.props.onCreate({ username });
      this.setState({ showInput: false });
    }
  };
  render() {
    return (
      <span>
        {this.state.showInput ? (
          <span className="flex-parent flex-parent--row ">
            {this.props.forBlacklist ? (
              <BlackListUser onSave={this.onSave} />
            ) : (
              <WhiteListUser onSave={this.onSave} />
            )}

            {/* <UserAutocomplete
                placeholder="user"
                className="wmin180"
                onChange={this.onUserChange}
                value={this.state.userValues}
                name="blacklist_user"
              /> */}
          </span>
        ) : (
          <Button
            className="input wmax120 ml12"
            onClick={() => this.setState({ showInput: true })}
          >
            Add+
          </Button>
        )}
      </span>
    );
  }
}

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
  onSave = event => {
    this.setState({
      editing: false
    });
    this.props.onCreate(this.state.value);
  };
  render() {
    return (
      <span>
        {this.state.editing ? (
          <span className="flex-parent flex-parent--row ">
            <input
              placeholder={this.props.placeholder}
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
            <Button className="input wmax120 ml6" onClick={this.onSave}>
              Save
            </Button>
          </span>
        ) : (
          <Button className="input wmax120 ml12" onClick={this.onClick}>
            Add+
          </Button>
        )}
      </span>
    );
  }
}
const BlackListBlock = ({ data, removeFromBlackList }) => (
  <BlockMarkup>
    <span>
      <span>{data.getIn(['username'])}</span>
      <span className="txt-em color-gray pl6">({data.getIn(['uid'])})</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: getObjAsQueryParam('filters', {
            users: [
              {
                label: data.getIn(['username']),
                value: data.getIn(['username'])
              }
            ]
          })
        }}
      >
        OSMCha
      </Link>
      <Button
        className="mr3"
        onClick={() => removeFromBlackList(data.getIn(['uid']))}
      >
        Remove
      </Button>
    </span>
  </BlockMarkup>
);

const WhiteListBlock = ({ data, removeFromWhiteList }) => (
  <BlockMarkup>
    <span>
      <span>{data}</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: getObjAsQueryParam('filters', {
            users: [
              {
                label: data,
                value: data
              }
            ]
          })
        }}
      >
        OSMCha
      </Link>
      <Button className="mr3" onClick={() => removeFromWhiteList(data)}>
        Remove
      </Button>
    </span>
  </BlockMarkup>
);
const AOIsBlock = ({ data, activeAoiId, removeAoi }) => (
  <BlockMarkup>
    <span>
      <span
        className={`${activeAoiId === data.getIn(['id']) ? 'txt-bold' : ''}`}
      >
        {data.getIn(['properties', 'name'])}
        {activeAoiId === data.getIn(['id']) ? '*' : ''}
      </span>
      <span className="txt-em color-gray pl6">({data.getIn(['id'])})</span>
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
      <CustomURL
        href={`${API_URL}/aoi/${data.getIn(['id'])}/changesets/feed/`}
        className="mr3"
        iconName="rss"
      />
    </span>
  </BlockMarkup>
);

const ListFortified = ({
  onAdd,
  onRemove,
  data,
  TargetBlock,
  propsToPass,
  SaveComp
}) => (
  <div>
    {data.map((e, i) => <TargetBlock key={i} data={e} {...propsToPass} />)}
    {SaveComp}
  </div>
);

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
  modal: any => any,
  whitelisted: Map<string, *>,
  blacklisted: Map<object, *>,
  addToBlacklist: string => void,
  removeFromBlacklist: string => void,
  addToWhitelist: string => void,
  removeFromWhitelist: string => void
};
class User extends React.PureComponent<any, propsType, any> {
  createAOIPromise;
  state = {
    userValues: null
  };
  componentWillUnmount() {
    this.createAOIPromise && this.createAOIPromise.cancel();
  }

  // blacklist
  addToBlackList = ({ username, uid }: { username: string, uid: string }) => {
    if (!username || !uid) return;
    this.props.addToBlacklist({ username, uid });
  };
  removeFromBlackList = (uid: number) => {
    if (!uid) return;
    this.props.removeFromBlacklist(uid);
  };
  // whitelist - trusted users
  addToWhiteList = ({ username }: { username: string }) => {
    if (!username) return;
    this.props.addToWhitelist(username);
  };
  removeFromWhiteList = (username: string) => {
    if (!username) return;
    this.props.removeFromWhitelist(username);
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
          // const location = {
          //   ...this.props.location, //  clone it
          //   pathname: '/user'
          // };
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
  onUserChange = (value: ?Array<Object>) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value
    });
  };
  render() {
    const userDetails = this.props.userDetails;
    let blackList = this.props.blacklisted ? this.props.blacklisted : List();

    blackList = blackList.sortBy(
      a => a.get('username'),
      (a: string, b: string) => a.localeCompare(b)
    );
    let trustedUsers = this.props.whitelisted ? this.props.whitelisted : List();
    trustedUsers = trustedUsers.sortBy(
      a => a,
      (a: string, b: string) => a.localeCompare(b)
    );
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white${
          window.innerWidth < 800 ? 'viewport-full' : ''
        }`}
      >
        <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l txt-bold color-gray--dark">
            <span>User</span>
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
                  : 'stranger'}!
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
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Current Token: </p>
              <p className="flex-child">{this.props.token}</p>
            </span>

            {userDetails.get('is_staff') && (
              <span className="ml12 flex-parent flex-parent--row my3">
                <p className="flex-child txt-bold w120">Staff: </p>
                <p className="flex-child">Yes</p>
              </span>
            )}
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                    <span className="txt-bold">Review Comments Template </span>
                  </h2>
                  <EditUserDetails />
                </div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                    <span className="txt-bold">Saved Filters</span>
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
                </div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
                    Trusted Users
                  </h2>
                  <ListFortified
                    data={trustedUsers}
                    TargetBlock={WhiteListBlock}
                    propsToPass={{
                      removeFromWhiteList: this.removeFromWhiteList
                    }}
                    SaveComp={<SaveUser onCreate={this.addToWhiteList} />}
                  />
                </div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
                    Watchlist
                  </h2>
                  <ListFortified
                    data={blackList}
                    TargetBlock={BlackListBlock}
                    propsToPass={{
                      removeFromBlackList: this.removeFromBlackList
                    }}
                    SaveComp={
                      <SaveUser
                        onCreate={this.addToBlackList}
                        forBlacklist={true}
                      />
                    }
                  />
                </div>
              </div>
            )}
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
    aoi: cancelablePromise(fetchAllAOIs(props.token))
  }),
  (nextProps: propsType, props: propsType) => true,
  User
);

User = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    filters: state.filters.get('filters'),
    whitelisted: state.whitelist.get('whitelist'),
    blacklisted: state.blacklist.get('blacklist'),
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
    push,
    addToBlacklist,
    removeFromBlacklist,
    addToWhitelist,
    removeFromWhitelist
  }
)(User);

export { User };
