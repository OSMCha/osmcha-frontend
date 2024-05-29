// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { getFinalToken } from '../store/auth_actions';
import type { RootStateType } from '../store';

class Authorized extends React.PureComponent {
  props: {
    location: Object,
    getFinalToken: string => mixed,
    push: any => any
  };
  state = {
    isReadyToRedirect: false
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    let authCode = params.get('code');
    this.props.getFinalToken(authCode);
    this.props.push({ ...this.props.location, search: '', pathname: '/' });
  }

  render() {
    return <div className="center">Logging in...</div>;
  }
}

Authorized = connect(
  (state: RootStateType, props) => ({
    location: state.routing.location
  }),
  {
    getFinalToken,
    push
  }
)(Authorized);

export { Authorized };
