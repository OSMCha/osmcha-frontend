// @flow
import {Map} from 'immutable';
import {SAVE_OAUTH_OBJ, SAVE_TOKEN, CLEAR_SESSION} from './auth_actions';
export type AuthType = Map<
  | 'oAuthToken' //  osm
  | 'oAuthTokenSecret'
  | 'token', any>; // osmcha uses this

const initialState: AuthType = Map({
  oAuthToken: null,
  oAuthTokenSecret: null,
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
        .set('oAuthTokenSecret', action.oauth_token_secret);
    }
    case SAVE_TOKEN: {
      return state.set('token', action.token);
    }
    case CLEAR_SESSION: {
      return Map({});
    }
    default:
      return state;
  }
}
