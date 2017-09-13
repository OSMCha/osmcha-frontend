// @flow
import React from 'react';
import showdown from 'showdown';
import { cancelablePromise } from '../utils/promise';

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

export class About extends React.PureComponent {
  state = {
    about: null
  };
  cancellablePromise = null;
  componentDidMount() {
    this.cancellablePromise = cancelablePromise(
      fetch(
        'https://raw.githubusercontent.com/mapbox/osmcha-frontend/master/ABOUT.md'
      ).then(r => r.text())
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
      <div className="scroll-auto about-page-height flex-parent flex-parent--column pb12 flex-parent--center-cross">
        <div
          id="guide"
          className="pb36 px12 wmax720"
          dangerouslySetInnerHTML={{
            __html: this.state.about
          }}
        />
      </div>
    );
  }
}
