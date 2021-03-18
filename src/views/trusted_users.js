// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';

import { getObjAsQueryParam } from '../utils/query_params';
import { BlockMarkup } from '../components/user/block_markup';
import { SaveUser } from '../components/user/save_user';
import {
  addToTrustedlist,
  removeFromTrustedlist
} from '../store/trustedlist_actions';
import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import type { RootStateType } from '../store';

const TrustedListBlock = ({ data, removeFromTrustedList }) => (
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
      <Button className="mr3" onClick={() => removeFromTrustedList(data)}>
        Remove
      </Button>
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
    {data.map((e, i) => (
      <TargetBlock key={i} data={e} {...propsToPass} />
    ))}
    {SaveComp}
  </div>
);

type propsType = {
  avatar: ?string,
  token: string,
  data: Map<string, any>,
  location: Object,
  userDetails: Map<string, any>,
  reloadData: () => any,
  logUserOut: () => any,
  push: any => any,
  modal: any => any,
  trustedList: Map<string, *>,
  addToTrustedlist: string => void,
  removeFromTrustedlist: string => void
};
class TrustedUsers extends React.PureComponent<any, propsType, any> {
  state = {
    userValues: null
  };
  addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    this.props.addToTrustedlist(username);
  };
  removeFromTrustedList = (username: string) => {
    if (!username) return;
    this.props.removeFromTrustedlist(username);
  };
  onUserChange = (value: ?Array<Object>) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value
    });
  };
  render() {
    let trustedUsers = this.props.trustedList ? this.props.trustedList : List();
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
            <span className="fl">
              <Avatar size={36} url={this.props.avatar} />
            </span>
            <span className="pl6 line45">Trusted users</span>
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
          <div className="flex-parent flex-parent--column align justify--space-between">
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
                    My trusted users list
                  </h2>
                  <ListFortified
                    data={trustedUsers}
                    TargetBlock={TrustedListBlock}
                    propsToPass={{
                      removeFromTrustedList: this.removeFromTrustedList
                    }}
                    SaveComp={<SaveUser onCreate={this.addToTrustedList} />}
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

TrustedUsers = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    trustedList: state.trustedlist.get('trustedlist'),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar'])
  }),
  {
    logUserOut,
    modal,
    push,
    addToTrustedlist,
    removeFromTrustedlist
  }
)(TrustedUsers);

export { TrustedUsers };
