// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import { appVersion, isDev, isStaging, isLocal } from '../config';
import banner from '../assets/banner.png';
import work_flow from '../assets/work_flow.png';

export function Home() {
  return (
    <div className="flex-parent flex-parent--column flex-parent--center-cross h-full my60">
      <div className="flex-child flex-child--grow">&nbsp;</div>
      <div className="flex-parent flex-parent--column flex-parent--center-cross ">
        <img src={banner} style={{ width: '40vw' }} />
        <img src={work_flow} style={{ width: '35vw' }} className="pt36" />
      </div>
      <div className="flex-child flex-child--grow">&nbsp;</div>
      <div className="flex-parent flex-parent--column align-center txt-l">
        <div className="txt-xl">
          v{appVersion}{isDev && ' Dev'}
          {isStaging && ' Staging'}{isLocal && ' Local'}
        </div>
        <div className="flex-parent flex-parent--row flex-parent--center-main">
          <Link
            className="link link--gray flex-parent flex-parent--row flex-parent--center-cross mx6"
            to="/about"
          >
            <svg className="icon"><use xlinkHref="#icon-info" /></svg>{' '}
            <span>Guide</span>
          </Link>{' '}
          |{' '}
          <a
            target="__blank"
            className="link link--gray  flex-parent flex-parent--row flex-parent--center-cross mx6"
            href="https://github.com/mapbox/osmcha-frontend/blob/master/CONTRIBUTING.md"
          >
            <svg className="icon"><use xlinkHref="#icon-github" /></svg>{' '}
            <span>Github</span>
          </a>{' '}
          |{' '}
          <a
            target="__blank"
            className="link link--gray  flex-parent flex-parent--row flex-parent--center-cross mx6"
            href="https://github.com/mapbox/osmcha-frontend/issues"
          >
            <svg className="icon"><use xlinkHref="#icon-bug" /></svg>{' '}
            <span>File an issue</span>
          </a>
        </div>
      </div>
      <div className="flex-child flex-child--grow">&nbsp;</div>
    </div>
  );
}
