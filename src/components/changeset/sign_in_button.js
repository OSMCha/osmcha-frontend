import React from 'react';
import { connect } from 'react-redux';

import { createPopup } from '../../utils/create_popup';
import { handlePopupCallback } from '../../utils/handle_popup_callback';
import { osmAuthUrl } from '../../config/constants';
import type { RootStateType } from '../../store';
import { getFinalToken } from '../../store/auth_actions';
import { getChangesetsPage } from '../../store/changesets_page_actions';
import { getChangeset } from '../../store/changeset_actions';

class SignInButton extends React.PureComponent {
  props: {
    text: string,
    oAuthToken: ?string,
    pageIndex: number,
    getFinalToken: string => mixed,
    getChangeset: string => mixed,
    getChangesetsPage: string => mixed
  };

  handleLoginClick = () => {
    var oAuthToken = this.props.oAuthToken;
    if (!oAuthToken) return;

    createPopup('oauth_popup', `${osmAuthUrl}?oauth_token=${oAuthToken}`);
    handlePopupCallback().then(oAuthObj => {
      this.props.getFinalToken(oAuthObj.oauth_verifier);
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

SignInButton = connect(
  (state: RootStateType, props) => ({
    oAuthToken: state.auth.get('oAuthToken'),
    pageIndex: state.changesetsPage.get('pageIndex') || 0
  }),
  {
    getFinalToken,
    getChangeset,
    getChangesetsPage
  }
)(SignInButton);

export { SignInButton };
