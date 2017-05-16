import React from 'react';

export class Floater extends React.PureComponent {
  render() {
    return (
      <div className={`fixed ${this.props.className}`} style={this.props.style}>
        <div
          className="flex-parent flex-parent--column flex-parent--center-cross "
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
