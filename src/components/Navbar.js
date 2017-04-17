// @flow
import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

class Navbar extends PureComponent {
  props: {
    pathname: string,
  };
  render() {
    const {pathname} = this.props;
    return (
      <nav className="m12">
        <Link
          className={classNames(
            {'is-active': pathname === '/'},
            'flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3',
          )}
          to="/"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-home" /></svg> Home
        </Link>
        <Link
          className={classNames(
            {'is-active': pathname === '/about'},
            'flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3',
          )}
          to="/about"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-info" /></svg>
          About
        </Link>
        <Link
          className={classNames(
            {'is-active': pathname === '/stats'},
            'flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3',
          )}
          to="/stats"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-database" /></svg>
          Stats
        </Link>
        <Link
          className={
            `
            ${pathname === '/features' ? 'is-active' : ''} 
            'flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3',
            `
          }
          to="/features"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-marker" /></svg>
          Features
        </Link>
        <Link
          className="flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3"
          to="/"
        >
          <svg className="icon mr3"><use xlinkHref="#icon-logout" /></svg>
          Logout
        </Link>
      </nav>
    );
  }
}
Navbar = connect(state => state.routing.location)(Navbar);
export {Navbar};
