// @flow
import {Map} from 'immutable';
import {SAVE_OSMCHA_OAUTH_OBJ} from './auth_actions';
export type AuthType = Map<
  | 'osmChaOAuthToken' // from osmcha's first post request
  | 'osmChaOAuthTokenSecret', any>;

const initialState: AuthType = Map({
  osmChaOAuthToken: null,
  osmChaOAuthTokenSecret: null,
});

export function authReducer(
  state: AuthType = initialState,
  action: Object,
): AuthType {
  switch (action.type) {
    case SAVE_OSMCHA_OAUTH_OBJ: {
      return state
        .set('osmChaOAuthToken', action.oAuthObj.oauth_token)
        .set('osmChaOAuthTokenSecret', action.oAuthObj.oauth_token_secret);
    }
    default:
      return state;
  }
}
