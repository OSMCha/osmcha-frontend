import React from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter({
  // simpleLineBreaks: true,
  // flavour: 'github'
  ghCompatibleHeaderId: true
});

export class About extends React.PureComponent {
  state = {
    markdown: null
  };
  componentDidMount() {
    fetch(
      'https://raw.githubusercontent.com/mapbox/osmcha-frontend/master/ABOUT.md'
    )
      .then(r => r.text())
      .then(markdown => this.setState({ markdown }));
  }
  render() {
    return (
      <div className="h-auto">
        <div
          className="about-page color-white scroll-auto"
          style={{ height: '100vh' }}
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(this.state.markdown)
          }}
        />
      </div>
    );
  }
}
