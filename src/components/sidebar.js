// @flow
import React from 'react';
import {Tabs} from './tabs';
import {User} from './user';
import {ChangesetsList} from '../views/changesets_list';
import {Navbar} from './navbar';
const Logo = () => (
  <div className="border-b border-b--2 border--gray-light">
    <h3 className="flex-parent flex-parent-row inline-block pl3">
      <span className="txt-fancy color-gray txt-xl">
        <span className="color-green txt-bold">OSM</span> CHA
      </span>
      <svg className="icon mr3"><use xlinkHref="#icon-question" /></svg>
    </h3>
    <div className="flex-child px12">
      <User />
    </div>
  </div>
);

export function Sidebar() {
  return (
    <div
      className="flex-parent flex-parent--column h-full hmax-full bg-gray-faint"
    >
      <div className="flex-child flex-child">
        <Navbar
          title={
            <span className="txt-fancy color-gray txt-xl">
              <span className="color-green txt-bold">OSM</span> CHA
            </span>
          }
        />
      </div>
      <div className="flex-child px12 mt12">
        {/* <Tabs />*/}
      </div>
      <ChangesetsList />
    </div>
  );
}
