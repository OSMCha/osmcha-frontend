import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

export class Navbar extends PureComponent {
  render() {
    return (
      <nav className="flex-parent">
        <div className="align-items--center flex-parent">
          <div className="flex-child mb-logo mb-logo--gray-dark" />
          <span
            className="border-l border--2 txt-fancy color-gray txt-l inline-block pl12 ml12"
          >
            OSMCha
          </span>
          <ul className="flex-parent flex-parent--row">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/stats">Stats</Link></li>
            <li><Link to="/features">Features</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
