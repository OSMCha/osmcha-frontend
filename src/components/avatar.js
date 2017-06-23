import React from 'react';
import Placeholder from './user.jpg';

export class Avatar extends React.PureComponent {
  props: {
    url: string
  };
  state = {
    loaded: false
  };
  handleImageLoaded() {
    this.setState({ loaded: true });
  }

  handleImageErrored() {
    this.setState({ loaded: false });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({
        loaded: false
      });
    }
  }
  render() {
    let url: string = Placeholder;
    if (this.props.url) {
      url = this.props.url;
      if (url.indexOf('http://') > -1) {
        url = url.slice(5);
      }
    }
    return (
      <div>
        <img
          style={{
            maxWidth: this.props.size || 64,
            maxHeight: this.props.size || 64,
            display: this.state.loaded ? 'block' : 'none'
          }}
          className="round-full"
          src={url || Placeholder}
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
        />
        <img
          style={{
            maxWidth: this.props.size || 64,
            maxHeight: this.props.size || 64,
            display: !this.state.loaded ? 'block' : 'none'
          }}
          className="round-full border border-gray--light border--1"
          src={Placeholder}
        />
      </div>
    );
  }
}
