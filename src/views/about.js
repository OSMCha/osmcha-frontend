// @flow
import React from 'react';
import showdown from 'showdown';
import { cancelablePromise } from '../utils/promise';
import { appVersion, isDev, isStaging } from '../config';

const converter = new showdown.Converter({
  ghCompatibleHeaderId: true,
  extensions: formatMarkdown()
});

converter.setFlavor('github');

function formatMarkdown() {
  return [
    {
      type: 'output',
      regex: /a href=/g,
      replace: 'a class="link" href='
    },
    {
      type: 'output',
      regex: /\<h3/g,
      replace: '<h3 class="txt-l txt-bold mt18"'
    },
    {
      type: 'output',
      regex: /\<h2/g,
      replace:
        '<h2 class="txt-xl txt-bold mt24 mb12 border-b border--gray-light border--1"'
    },
    {
      type: 'output',
      regex: /\<h1/g,
      replace:
        '<h1 class="txt-xl txt-bold mt24 mb12 border-b border--gray-light border--1"'
    },
    {
      type: 'output',
      regex: /\<ul\>/g,
      replace: '<ul class="pl24">'
    },
    {
      type: 'output',
      regex: /\<li\>/g,
      replace: '<li style="list-style-type: circle;">'
    },
    {
      type: 'output',
      regex: /img src=/g,
      replace: `img 
      class="py12 my12 border border--gray-light border--2"
      style="margin-left: auto;
             margin-right: auto;
             display: block;
            " src=`
    }
  ];
}

function timer(time) {
  return new Promise(res => setTimeout(res, time));
}

export class About extends React.PureComponent {
  state = {
    about: null
  };
  cancellablePromise = null;
  componentDidMount() {
    this.cancellablePromise = cancelablePromise(
      timer(200)
        .then(() =>
          fetch(
            'https://raw.githubusercontent.com/mapbox/osmcha-frontend/master/ABOUT.md'
          )
        )
        .then(r => r.text())
    );
    this.cancellablePromise.promise
      .then(markdown => this.setState({ about: converter.makeHtml(markdown) }))
      .catch(e => {});
  }
  componentWillUnmount() {
    this.cancellablePromise && this.cancellablePromise.cancel();
  }
  render() {
    return (
      <div className="bg-white clip">
        <div className="scroll-auto about-page-height justify--center flex-parent flex-parent--column pb12 flex-parent--center-cross">
          <div className="half-body-margin-top">
            <span className="txt-fancy color-gray txt-jumbo">
              <span className="color-green txt-bold">
                OSM
              </span>
              Cha<span className="txt-s">
                v{appVersion}{isDev && ' Dev'}
                {isStaging && ' Staging'}
              </span>
            </span>
          </div>
          <div className="mb300 pb60">
            <button className="btn mx6"><a href="#guide">Guide</a></button>
            <button className="btn mx6">
              <a href="#are-there-keyboard-shortcuts-in-osmcha">Shortcuts</a>
            </button>
            <button className="btn mx6">
              <a
                target="__blank"
                href="https://github.com/mapbox/osmcha-frontend/issues"
              >
                Bugs
              </a>
            </button>
            <button className="btn mx6">
              <a
                target="__blank"
                href="https://github.com/mapbox/osmcha-frontend/blob/master/CONTRIBUTING.md"
              >
                Contribute
              </a>
            </button>
          </div>
          <div className="flex-parent flex-parent--column  flex-child--grow">
            <div
              id="guide"
              className="pb36 px12 wmax720"
              dangerouslySetInnerHTML={{
                __html: this.state.about
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
