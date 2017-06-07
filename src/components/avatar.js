import React from 'react';
import Placeholder from './user.jpg';

export class Avatar extends React.PureComponent {
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
    return (
      <div>
        <img
          style={{
            maxWidth: this.props.size || 64,
            maxHeight: this.props.size || 64,
            display: this.state.loaded ? 'block' : 'none'
          }}
          className="round border border-gray--light border--1"
          src={this.props.url || Placeholder}
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
        />
        <img
          style={{
            maxWidth: this.props.size || 64,
            maxHeight: this.props.size || 64,
            display: !this.state.loaded ? 'block' : 'none'
          }}
          className="round border border-gray--light border--1"
          src={Placeholder}
        />
      </div>
    );
  }
}
