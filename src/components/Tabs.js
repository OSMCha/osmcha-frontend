// @flow
import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

class Tabs extends PureComponent {
  props: {
    pathname: string,
  };
  render() {
    const {pathname} = this.props;
    return (
      <div className="mb12 mr12 flex-parent flex-parent--row justify--center">
        <span className="flex-child">
          <Link
            className={classNames(
              {'is-active': pathname === '/'},
              'flex-parent-inline btn  color-gray color-white-on-active bg-transparent bg-darken10-on-hover bg-gray-on-active txt-s ml3',
            )}
            to="/"
          >
            <svg className="icon mr3"><use xlinkHref="#icon-database" /></svg>
            Changesets
          </Link>
          <Link
            className={classNames(
              {'is-active': pathname === '/features'},
              'flex-parent-inline btn  color-gray color-white-on-active bg-transparent bg-darken10-on-hover bg-gray-on-active txt-s ml3',
            )}
            to="/features"
          >
            <svg className="icon icon-green mr3">
              <use xlinkHref="#icon-marker" />
            </svg>
            Features
          </Link>
        </span>
      </div>
    );
  }
}
Tabs = connect(state => state.routing.location)(Tabs);
export {Tabs};

// <Link
//   className={classNames(
//     {'is-active': pathname === '/stats'},
//     'flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3',
//   )}
//   to="/stats"
// >
//   <svg className="icon mr3"><use xlinkHref="#icon-database" /></svg>
//   Stats
// </Link>
