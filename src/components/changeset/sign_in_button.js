import React from 'react';
import { connect } from 'react-redux';

import type { RootStateType } from '../../store';
import { getAuthUrl } from '../../network/auth';

class SignInButton extends React.PureComponent {
  props: {
    text: string,
    oAuthToken: ?string,
    pageIndex: number
  };

  handleLoginClick = () => {
    getAuthUrl().then(res => {
      window.location.assign(res.auth_url);
    });
  };
  render() {
    const extraClasses = this.props.className
      ? this.props.className
      : 'border--darken5 border--darken25-on-hover bg-darken10 bg-darken5-on-hover color-gray';
    return (
      <button
        onClick={this.handleLoginClick}
        className={`btn btn--s border border--1 round transition ${extraClasses}`}
      >
        <svg className="icon w18 h18 inline-block align-middle pr3">
          <use xlinkHref="#icon-osm" />
        </svg>
        {this.props.text}
      </button>
    );
  }
}

SignInButton = connect((state: RootStateType, props) => ({
  oAuthToken: state.auth.get('oAuthToken'),
  pageIndex: state.changesetsPage.get('pageIndex') || 0
}))(SignInButton);

export { SignInButton };
