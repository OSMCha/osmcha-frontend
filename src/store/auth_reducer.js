// @flow
import {Map} from 'immutable';
import {
  SAVE_OAUTH_OBJ,
  SAVE_TOKEN,
  CLEAR_SESSION,
  LOGIN_ERROR,
} from './auth_actions';
export type AuthType = Map<
  | 'oAuthToken' //  osm
  | 'oAuthTokenSecret'
  | 'error'
  | 'token', any>; // osmcha uses this

const initialState: AuthType = Map({
  oAuthToken: null,
  oAuthTokenSecret: null,
  error: null,
  token: null,
});

export function authReducer(
  state: AuthType = initialState,
  action: Object,
): AuthType {
  switch (action.type) {
    case SAVE_OAUTH_OBJ: {
      return state
        .set('oAuthToken', action.oauth_token)
        .set('oAuthTokenSecret', action.oauth_token_secret)
        .set('error', null);
    }
    case SAVE_TOKEN: {
      return state.set('token', action.token).set('error', null);
    }
    case CLEAR_SESSION: {
      return Map({error: state.get('error')}); // retain the error
    }
    case LOGIN_ERROR: {
      return state.set('error', action.error);
    }
    default:
      return state;
  }
}
