// @flow
import React from 'react';
import type {Children} from 'react';
import {Tabs} from './Tabs';
import {User} from './User';
import {ChangesetsList} from '../views/changesets_list';
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

let Sidebar = function() {
  return (
    <div
      className="flex-parent flex-parent--column viewport-third h-full hmax-full bg-white pt12"
    >
      <div className="flex-child flex-child px12">
        <Logo />
      </div>

      <div className="flex-child px12 mt12">
        <Tabs />
      </div>
      <ChangesetsList />
    </div>
  );
};

export {Sidebar};
