import React from 'react';

export class Floater extends React.PureComponent {
  render() {
    return (
      <div
        className={`fixed transition h-auto  mt3 scroll-auto ${this.props.className}`}
        style={this.props.style}
      >
        <div className="flex-parent flex-parent--column pb12 flex-parent--center-cross ">
          {this.props.children}
        </div>
      </div>
    );
  }
}
