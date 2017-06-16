import React from 'react';
import showdown from 'showdown';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

const converter = new showdown.Converter({
  // simpleLineBreaks: true,
  // flavour: 'github'
  ghCompatibleHeaderId: true,
  extensions: myext()
});

converter.setFlavor('github');

function myext() {
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
    markdown: null
  };
  componentDidMount() {
    setTimeout(() => {
      fetch(
        'https://raw.githubusercontent.com/mapbox/osmcha-frontend/master/ABOUT.md'
      )
        .then(r => r.text())
        .then(markdown => this.setState({ markdown }));
    }, 1000);
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
                v{process.env.REACT_APP_VERSION || ''}
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
                href="https://github.com/mapbox/osmcha-frontend"
              >
                Contribute
              </a>
            </button>
            <button className="btn mx6">
              <a href="#whats-new-in-osmcha">Whats New</a>
            </button>
          </div>
          <div className="flex-parent flex-parent--column  flex-child--grow">
            <div
              id="guide"
              className="pb36 px12 wmax720"
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(this.state.markdown)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
