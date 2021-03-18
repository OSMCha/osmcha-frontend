import React from 'react';
import { connect } from 'react-redux';

import { Dropdown } from '../dropdown';
import {
  addToWatchlist,
  removeFromWatchlist
} from '../../store/watchlist_actions';
import {
  addToWhitelist,
  removeFromWhitelist
} from '../../store/whitelist_actions';

type propsType = {
  user: Map<string, any>,
  whitelisted: Map<string, *>,
  watchlisted: Map<object, *>,
  addToWatchlist: string => void,
  removeFromWatchlist: string => void,
  addToWhitelist: string => void,
  removeFromWhitelist: string => void
};

class TrustWatchUser extends React.PureComponent<any, propsType, any> {
  handleVerify = (arr: Array<Object>) => {
    const username = this.props.user.get('name');
    const uid = this.props.user.get('uid');
    if (arr.length === 1) {
      if (arr[0].value === false) {
        this.props.addToWatchlist({ username, uid });
      }
      if (arr[0].value === true) {
        this.props.addToWhitelist(username);
      }
    } else if (arr.length > 1) {
      throw new Error('verify array is big');
    }
  };

  handleVerifyClear = () => {
    const is_whitelisted =
      this.props.whitelisted.indexOf(this.props.user.get('name')) !== -1;
    const is_watchlisted =
      this.props.watchlisted
        .map(user => user.get('uid'))
        .indexOf(this.props.user.get('uid')) !== -1;

    if (is_watchlisted) {
      this.props.removeFromWatchlist(this.props.user.get('uid'));
    } else if (is_whitelisted) {
      this.props.removeFromWhitelist(this.props.user.get('name'));
    }
  };

  render() {
    const watchlisted = this.props.watchlisted.map(user => user.get('uid'));

    if (watchlisted.includes(this.props.user.get('uid'))) {
      return (
        <div className="flex-parent-inline">
          <span className="btn btn--s border border--1 round color-gray transition pl12 pr6 bg-lighten50 border--red-light">
            <span>
              <svg className="icon inline-block align-middle pl3 w18 h18 color-gray">
                <use xlinkHref="#icon-alert" />
              </svg>
              Watchlisted user
            </span>
            <svg
              onClick={() =>
                this.props.removeFromWatchlist(this.props.user.get('uid'))
              }
              className="icon inline-block align-middle pl3 pb3 w18 h18 pointer color-gray"
            >
              <use xlinkHref="#icon-close" />
            </svg>
          </span>
        </div>
      );
    } else if (
      this.props.whitelisted &&
      this.props.whitelisted.includes(this.props.user.get('name'))
    ) {
      return (
        <div className="flex-parent-inline">
          <span className="btn btn--s border border--1 round color-gray transition pl12 pr6 bg-lighten50 border--green-light">
            <span>
              <svg className="icon inline-block align-middle pl3 w18 h18 color-gray">
                <use xlinkHref="#icon-star" />
              </svg>
              Trusted user
            </span>
            <svg
              onClick={e =>
                this.props.removeFromWhitelist(this.props.user.get('name'))
              }
              className="icon inline-block align-middle pl3 pb3 w18 h18 pointer color-gray"
            >
              <use xlinkHref="#icon-close" />
            </svg>
          </span>
        </div>
      );
    }

    return (
      <div className="select-container">
        <Dropdown
          eventTypes={['click', 'touchend']}
          value={[]}
          onAdd={() => {}}
          onRemove={() => {}}
          options={[
            {
              value: false,
              label: 'Add to your watchlist'
            },
            {
              value: true,
              label: 'Add to your trusted users list'
            }
          ]}
          onChange={this.handleVerify}
          display="Trust / Watch user"
        />
      </div>
    );
  }
}

TrustWatchUser = connect(
  (state: RootStateType, props) => ({
    whitelisted: state.whitelist.get('whitelist'),
    watchlisted: state.watchlist.get('watchlist')
  }),
  {
    addToWatchlist,
    removeFromWatchlist,
    addToWhitelist,
    removeFromWhitelist
  }
)(TrustWatchUser);

export { TrustWatchUser };
