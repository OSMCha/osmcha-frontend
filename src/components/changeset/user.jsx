import React from 'react';
import { Link } from 'react-router-dom';
import showdown from 'showdown';
import { parse } from 'date-fns';

import { Avatar } from '../avatar';
import { getObjAsQueryParam } from '../../utils/query_params';
import { RelativeTime } from '../relative_time';
import { SignInButton } from './sign_in_button';
import { TrustWatchUser } from './trust_watch_user';
import { UserOSMLink } from './user_osm_link';

class UserLink extends React.PureComponent {
  getHarmfulObject() {
    if (this.props.harmful) {
      return {
        label: 'Show Bad only',
        value: true
      };
    } else {
      return {
        label: 'Show Good only',
        value: false
      };
    }
  }
  getLinkContent() {
    if (this.props.harmful) {
      return `${this.props.userDetails.get('harmful_changesets')} Bad`;
    } else {
      const count =
        this.props.userDetails.get('checked_changesets') -
        this.props.userDetails.get('harmful_changesets');
      return `${count} Good`;
    }
  }
  render() {
    return (
      <Link
        className="txt-underline-on-hover txt-bold cursor-pointer color-gray"
        to={{
          search: getObjAsQueryParam('filters', {
            uids: [
              {
                label: this.props.userDetails.get('uid'),
                value: this.props.userDetails.get('uid')
              }
            ],
            harmful: [this.getHarmfulObject()],
            date__gte: [{ label: '', value: '' }]
          }),
          pathname: '/'
        }}
      >
        {this.getLinkContent()}
      </Link>
    );
  }
}

// getObjAsQueryParam('filters', filters.toJS());
export class User extends React.PureComponent {
  renderUidFilterLink() {
    return (
      <Link
        className="txt-underline-on-hover txt-bold cursor-pointer color-gray"
        to={{
          search: getObjAsQueryParam('filters', {
            uids: [
              {
                label: this.props.userDetails.get('uid'),
                value: this.props.userDetails.get('uid')
              }
            ],
            date__gte: [{ label: '', value: '' }]
          }),
          pathname: '/'
        }}
      >
        {`${this.props.userDetails.get('count')} edits`}
      </Link>
    );
  }
  render() {
    const converter = new showdown.Converter({
      noHeaderId: true,
      simplifiedAutoLink: true
    });
    const UserDescriptionHTML = converter.makeHtml(
      this.props.userDetails.get('description') || ''
    );
    const registrationDate = this.props.userDetails.get('accountCreated')
      ? parse(
          this.props.userDetails.get('accountCreated'),
          // eslint-disable-next-line
          "yyyy-MM-dd'T'HH:mm:ssX",
          new Date()
        )
      : null;

    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          User{' '}
          {this.props.userDetails.get('uid') &&
            `/ ${this.props.userDetails.get('uid')}`}
        </h2>
        {this.props.userDetails.get('name') ? (
          <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
            <div>
              <Avatar size={96} url={this.props.userDetails.get('img')} />
              <div className="mt6 txt-bold color-gray align-center">
                {this.props.userDetails.get('name')}
              </div>
            </div>
            <div>
              <p className="txt-s color-gray align-center">
                {registrationDate != null && (
                  <React.Fragment>
                    Joined&nbsp;
                    <RelativeTime datetime={registrationDate} />
                    {' | '}
                  </React.Fragment>
                )}
                {this.props.userDetails.get('count')
                  ? this.renderUidFilterLink()
                  : `${this.props.userDetails.get(
                      'changesets_in_osmcha'
                    )} edits registered on OSMCha`}
              </p>
            </div>
            <div>
              <p className="txt-s color-gray align-center">
                <UserLink userDetails={this.props.userDetails} harmful={true} />
                &nbsp;and&nbsp;
                <UserLink
                  userDetails={this.props.userDetails}
                  harmful={false}
                />
                &nbsp;changesets
              </p>
            </div>

            <div className="mt6">
              <TrustWatchUser user={this.props.userDetails} />
            </div>

            <div className="mt12">
              <Link
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                to={{
                  search: getObjAsQueryParam('filters', {
                    users: [
                      {
                        label: this.props.userDetails.get('name'),
                        value: this.props.userDetails.get('name')
                      }
                    ],
                    date__gte: [{ label: '', value: '' }]
                  }),
                  pathname: '/'
                }}
              >
                OSMCha
              </Link>
              <UserOSMLink userName={this.props.userDetails.get('name')}>
                OSM
              </UserOSMLink>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title="Open in HDYC"
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                href={`https://hdyc.neis-one.org/?${this.props.userDetails.get(
                  'name'
                )}`}
              >
                HDYC
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Missing Maps"
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                href={`https://www.missingmaps.org/users/#/${this.props.userDetails.get(
                  'name'
                )}`}
              >
                Missing Maps
              </a>
            </div>

            {this.props.whosThat.size > 1 && (
              <div className="txt-s color-gray">
                Past usernames: &nbsp;
                {this.props.whosThat.slice(0, -1).map((e, k) => (
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
        ) : (
          <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
            <div>
              <Avatar size={96} url={this.props.userDetails.get('img')} />
              <div className="mt6 txt-bold color-gray align-center">
                {this.props.userDetails.get('name')}
              </div>
            </div>
            <div className="flex-parent flex-parent--column mt6 mb3">
              <SignInButton text="Sign in to see the user details" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
