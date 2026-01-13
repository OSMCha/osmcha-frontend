import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { getFinalToken } from '../store/auth_actions';
import type { RootStateType } from '../store';

interface AuthorizedProps {
  location: any;
  getFinalToken: (a: string) => unknown;
  push: (a: any) => any;
}

interface AuthorizedState {
  isReadyToRedirect: boolean;
}

class _Authorized extends React.PureComponent<AuthorizedProps, AuthorizedState> {
  state: AuthorizedState = {
    isReadyToRedirect: false,
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    let authCode = params.get('code');
    if (authCode) {
      this.props.getFinalToken(authCode);
    }
    this.props.push({ ...this.props.location, search: '', pathname: '/' });
  }

  render() {
    return <div className="center">Logging in...</div>;
  }
}

const Authorized = connect(
  (state: RootStateType, props) => ({
    location: state.routing.location,
  }),
  {
    getFinalToken,
    push,
  }
)(_Authorized);

export { Authorized };
