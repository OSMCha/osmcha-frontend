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
  addToBlacklist,
  removeFromBlacklist
} from '../store/blacklist_actions';
import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import type { RootStateType } from '../store';

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
  blacklisted: Map<object, *>,
  addToBlacklist: string => void,
  removeFromBlacklist: string => void
};
class Watchlist extends React.PureComponent<any, propsType, any> {
  state = {
    userValues: null
  };
  // blacklist
  addToBlackList = ({ username, uid }: { username: string, uid: string }) => {
    if (!username || !uid) return;
    this.props.addToBlacklist({ username, uid });
  };
  removeFromBlackList = (uid: number) => {
    if (!uid) return;
    this.props.removeFromBlacklist(uid);
  };
  onUserChange = (value: ?Array<Object>) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value
    });
  };
  render() {
    let blackList = this.props.blacklisted ? this.props.blacklisted : List();
    blackList = blackList.sortBy(
      a => a.get('username'),
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
            <span className="pl6 line45">Watchlist</span>
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
                  <h3 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
                    My watchlist
                  </h3>
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
            {this.props.token && (
              <span>
                <Link
                  className="input wmax140 ml12 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                  to={{
                    search: getObjAsQueryParam('filters', {
                      blacklist: [{ label: 'Yes', value: 'True' }]
                    })
                  }}
                >
                  Filter changesets
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Watchlist = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    blacklisted: state.blacklist.get('blacklist'),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar'])
  }),
  {
    logUserOut,
    modal,
    push,
    addToBlacklist,
    removeFromBlacklist
  }
)(Watchlist);

export { Watchlist };
