import React from "react";

interface FloaterProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export class Floater extends React.PureComponent<FloaterProps> {
  render() {
    return (
      <div
        className={`relative h-auto mt3 scroll-auto ${this.props.className}`}
      >
        <div
          style={this.props.style}
          className="fixed block flex-parent flex-parent--column pb12 flex-parent--center-cross "
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
