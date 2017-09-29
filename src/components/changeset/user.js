import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';
import { Link } from 'react-router-dom';
import showdown from 'showdown';
import { Avatar } from '../avatar';
import { getObjAsQueryParam } from '../../utils/query_params';
import { Button } from '../button';
import { cancelablePromise } from '../../utils/promise';
import {
  postUserToWhiteList,
  deleteFromWhiteList
} from '../../network/osmcha_whitelist';

class WhitelistUser extends React.PureComponent {
  props: {
    token: string,
    whitelisted: Map<string, *>,
    user_to_whitelist: string
  };
  constructor(props) {
    super(props);
    this.state = {
      is_whitelisted: this.props.whitelisted
        ? this.props.whitelisted.indexOf(props.user_to_whitelist) !== -1
        : false,
      hover: false
    };
  }
  _ref;

  addToWhiteList = event => {
    this.addToWhiteListPromise = cancelablePromise(
      postUserToWhiteList(this.props.token, this.props.user_to_whitelist)
    );

    this.addToWhiteListPromise.promise
      .then(r => {
        this.setState({ is_whitelisted: true });
      })
      .catch(e => {
        console.error(e);
      });
  };
  removeFromWhiteList = event => {
    this.deleteFromWhiteListPromise = cancelablePromise(
      deleteFromWhiteList(this.props.token, this.props.user_to_whitelist)
    );
    this.deleteFromWhiteListPromise.promise
      .then(r => {
        this.setState({ is_whitelisted: false });
      })
      .catch(e => {
        console.error(e);
      });
  };

  onClick = event => {
    if (this.state.is_whitelisted) {
      this.removeFromWhiteList();
    } else {
      this.addToWhiteList();
    }
  };

  handleMouseOver = event => {
    this.setState({ hover: true });
  };

  handleMouseOut = event => {
    this.setState({ hover: false });
  };

  render() {
    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {this.state.is_whitelisted ? (
          <Button
            className="bg-green-light btn btn--s border--green-light"
            onClick={this.onClick}
          >
            <svg
              className={`icon inline-block align-middle pl3 pb3 pointer ${this
                .state.hover
                ? 'color-red'
                : 'color-green'}`}
            >
              <use
                xlinkHref={`${this.state.hover
                  ? '#icon-close'
                  : '#icon-check'}`}
              />
            </svg>
            {`${this.state.hover
              ? 'Remove user from whitelist'
              : 'Whitelisted User'}`}
          </Button>
        ) : (
          <Button
            onClick={this.onClick}
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
          >
            <svg className="icon inline-block align-middle pl3 pb3 pointer">
              <use xlinkHref="#icon-plus" />
            </svg>
            Add user to your whitelist
          </Button>
        )}
      </div>
    );
  }
}

WhitelistUser = connect((state: RootStateType, props) => ({
  token: state.auth.get('token'),
  whitelisted: state.auth.getIn(['userDetails', 'whitelists'])
}))(WhitelistUser);
export { WhitelistUser };

// getObjAsQueryParam('filters', filters.toJS());
export function User({ userDetails, whosThat }) {
  const converter = new showdown.Converter({
    noHeaderId: true,
    simplifiedAutoLink: true
  });
  const UserDescriptionHTML = converter.makeHtml(
    userDetails.get('description') || ''
  );

  return (
    <div className="px12 py6">
      <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
        User / {userDetails.get('uid')}
      </h2>
      <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
        <div>
          <Avatar size={96} url={userDetails.get('img')} />
          <div className="mt6 txt-bold color-gray align-center">
            {userDetails.get('name')}
          </div>
        </div>
        <div>
          <WhitelistUser user_to_whitelist={userDetails.get('name')} />
        </div>
        <div>
          <p className="txt-s color-gray align-center">
            Joined {moment(userDetails.get('accountCreated')).fromNow(true)} ago
            | {userDetails.get('count')} edits
          </p>
        </div>
        <div>
          <p className="txt-s color-gray align-center">
            {userDetails.get('harmful_changesets')} Bad and &nbsp;
            {userDetails.get('checked_changesets') -
              userDetails.get('harmful_changesets')}{' '}
            Good Changesets
          </p>
        </div>
        <div className="mt6">
          <Link
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
            to={{
              search: getObjAsQueryParam('filters', {
                users: [
                  {
                    label: userDetails.get('name'),
                    value: userDetails.get('name')
                  }
                ]
              }),
              pathname: '/'
            }}
          >
            OSMCha
          </Link>
          <a
            target="_blank"
            rel="noopener noreferrer"
            title="Open in HDYC"
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
            href={`http://hdyc.neis-one.org/?${userDetails.get('name')}`}
          >
            HDYC
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            title="Open in OSM"
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
            href={`https://openstreetmap.org/user/${userDetails.get('name')}`}
          >
            OSM
          </a>
        </div>
        {whosThat.size > 1 && (
          <div className="txt-s color-gray">
            Past usernames: &nbsp;
            {whosThat.slice(0, -1).map((e, k) => (
              <span key={k} className="txt-em">
                {e}&nbsp;
              </span>
            ))}
          </div>
        )}
        <div className="mt12">
          <p
            className="txt-subhead txt-s txt-break-url user-description"
            dangerouslySetInnerHTML={{ __html: UserDescriptionHTML }}
          />
        </div>
      </div>
    </div>
  );
}
