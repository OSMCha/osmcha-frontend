import React from 'react';
import { Avatar } from '../avatar';
import moment from 'moment';
import AnchorifyText from 'react-anchorify-text';
import { Button } from '../button';
import AssemblyAnchor from '../assembly_anchor';

const DetailsFromOSMCha = ({ userDetails, filterChangesetsByUser }) =>
  <span>
    changesets in osmcha: {userDetails.get('changesets_in_osmcha')} <br />
    harmful: {userDetails.get('harmful_changesets')} <br />
    reviewed: {userDetails.get('checked_changesets')} <br />
    <Button onClick={filterChangesetsByUser} className="button">
      Filter by this user
    </Button>
  </span>;

export function User({ userDetails, filterChangesetsByUser }) {
  return (
    <div className="px12 py6">
      <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
        User
      </h2>
      <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
        <div>
          <Avatar url={userDetails.get('img')} />
          <div className="txt-s txt-bold color-gray align-center">
            {userDetails.get('name')}
          </div>
        </div>
        <div>
          <p className="txt-s color-gray align-center">
            Joined {moment(userDetails.get('accountCreated')).fromNow(true)} ago
            | {userDetails.get('count')} edits
          </p>
        </div>
        <div className="mt6">
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
        <div className="mt12">
          <p className="txt-subhead txt-s txt-break-url">
            <AnchorifyText text={userDetails.get('description') || ''}>
              <AssemblyAnchor />
            </AnchorifyText>
          </p>
        </div>
        <DetailsFromOSMCha
          userDetails={userDetails}
          filterChangesetsByUser={filterChangesetsByUser}
        />
      </div>
    </div>
  );
}
