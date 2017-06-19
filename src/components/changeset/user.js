import React from 'react';
import { Avatar } from '../avatar';
import moment from 'moment';
export function User({ userDetails }) {
  return (
    <div className="p12 ">
      <div>
        <h2 className="txt-l mr6 txt-bold">User: {userDetails.get('name')}</h2>
        <Avatar url={userDetails.get('img')} />
        <p className="flex-child txt-subhead my3  ml6">
          <a
            target="_blank"
            href={`http://hdyc.neis-one.org/?${userDetails.get('name')}`}
          >
            HDYC
          </a>
          <br />
          <a
            target="_blank"
            className="pointer"
            href={`https://openstreetmap.org/user/${userDetails.get('uid')}`}
          >
            OSM
          </a>
          <br />
          UID: {userDetails.get('uid')}<br />
          Edits: {userDetails.get('count')}<br />
          Desc: {userDetails.get('description') || '-'} <br />
          Age: {moment(userDetails.get('accountCreated')).fromNow(true)} <br />
        </p>
      </div>
    </div>
  );
}
