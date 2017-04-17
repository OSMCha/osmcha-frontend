// @flow
import React from 'react';
import type {Children} from 'react';
import {Tabs} from './Tabs';
import {User} from './User';
import {List} from './List';
const Logo = () => (
  <div className="border-b border-b--2 border--gray-light">
    <h3 className="flex-parent flex-parent-row inline-block pl12 ml12">
      <span className="txt-fancy color-gray txt-xl">
        <span className="color-green txt-bold">OSM</span> CHA
      </span>
      <svg className="icon mr3"><use xlinkHref="#icon-question" /></svg>
    </h3>
  </div>
);

let Sidebar = function() {
  return (
    <div
      className="flex-parent flex-parent--column viewport-third h-full hmax-full bg-white mt12"
    >
      <div className="flex-child flex-child px12">
        <Logo />
      </div>
      <div className="flex-child px12 mt12">
        <User />
      </div>
      <div className="flex-child px12 mt12">
        <Tabs />
      </div>
      <div className="flex-child flex-child--grow px12 scroll-auto mt12">
        <List />
      </div>
      <footer className="p12 bg-gray-faint txt-s">
        Footer content here
      </footer>
    </div>
  );
};

export {Sidebar};
