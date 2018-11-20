// @flow
import { Map, fromJS } from 'immutable';
import { AUTH } from './auth_actions';

export type AuthType = Map<
  'oAuthToken' | 'oAuthTokenSecret' | 'error' | 'token' | 'userDetails',
  any
>;

const initialState: AuthType = fromJS({
  oAuthToken: null,
  oAuthTokenSecret: null,
  error: null,
  token: null,
  userDetails: null
});

export function authReducer(
  state: AuthType = initialState,
  action: Object
): AuthType {
  switch (action.type) {
    case AUTH.saveOAuth: {
      return state
        .set('oAuthToken', action.oauth_token)
        .set('oAuthTokenSecret', action.oauth_token_secret)
        .set('error', null);
    }
    case AUTH.saveToken: {
      return state.set('token', action.token).set('error', null);
    }
    case AUTH.clearSession: {
      return fromJS({ error: state.get('error') }); // retain the error
    }
    case AUTH.loginError: {
      return state.set('error', action.error);
    }
    case AUTH.userDetails: {
      return state.set('userDetails', action.userDetails);
    }
    case AUTH.clearUserDetails: {
      return state.set('userDetails', Map());
    }
    default:
      return state;
  }
}
