import React from "react";
import { connect } from "react-redux";
import { push } from "redux-first-history";
import type { RootStateType } from "../store";
import { getFinalToken } from "../store/auth_actions";

interface AuthorizedProps {
  location: any;
  getFinalToken: (a: string) => unknown;
  push: (a: any) => any;
}

interface AuthorizedState {
  isReadyToRedirect: boolean;
}

class _Authorized extends React.PureComponent<
  AuthorizedProps,
  AuthorizedState
> {
  state: AuthorizedState = {
    isReadyToRedirect: false,
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const authCode = params.get("code");
    if (authCode) {
      this.props.getFinalToken(authCode);
    }
    this.props.push({ ...this.props.location, search: "", pathname: "/" });
  }

  render() {
    return <div className="center">Logging in...</div>;
  }
}

const Authorized = connect(
  (state: RootStateType, props) => ({
    location: state.router.location,
  }),
  {
    getFinalToken,
    push,
  },
)(_Authorized);

export { Authorized };
