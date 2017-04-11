import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

export class Navbar extends PureComponent {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/stats">Stats</Link></li>
          <li><Link to="/features">Features</Link></li>
        </ul>
      </nav>
    );
  }
}
