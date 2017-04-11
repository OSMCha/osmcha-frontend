import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

export class Navbar extends PureComponent {
  render() {
    return (
      <nav>
        <Link
          className="flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3 is-active"
          to="/"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-home" /></svg> Home
        </Link>
        <Link
          className="flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3"
          to="/about"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-info" /></svg>
          About
        </Link>
        <Link
          className="flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3"
          to="/stats"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-database" /></svg>
          Stats
        </Link>
        <Link
          className="flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3"
          to="/features"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-marker" /></svg>
          Features
        </Link>
      </nav>
    );
  }
}
