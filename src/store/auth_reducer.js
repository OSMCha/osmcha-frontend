// @flow
import { Map } from 'immutable';
import {
  SAVE_OAUTH_OBJ,
  SAVE_TOKEN,
  CLEAR_SESSION,
  LOGIN_ERROR,
  USER_DETAILS
} from './auth_actions';
export type AuthType = Map<

    | 'oAuthToken' //  osm
    | 'oAuthTokenSecret'
    | 'error'
    | 'token'
    | 'userDetails',
  any
>; // osmcha uses this

const initialState: AuthType = Map({
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
      return Map({ error: state.get('error') }); // retain the error
    }
    case LOGIN_ERROR: {
      return state.set('error', action.error);
    }
    case USER_DETAILS: {
      return state.set('userDetails', action.userDetails);
    }
    default:
      return state;
  }
}
