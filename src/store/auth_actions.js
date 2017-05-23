// @flow
import {put, call, take, delay} from 'redux-saga/effects';

import {postTokensOSMCha} from '../network/auth';

export type oAuthType = {
  oauth_token: ?string,
  oauth_token_secret: ?string,
  oauth_verifier: ?string,
  token: ?string,
};

export const POST_SOCIAL_TOKEN = 'POST_SOCIAL_TOKEN';
export const SAVE_OAUTH_OBJ = 'SAVE_OAUTH_OBJ';
export const GET_FINAL_TOKEN = 'GET_FINAL_TOKEN';
export const SAVE_TOKEN = 'SAVE_TOKEN';
export const LOGOUT = 'LOGOUT';
export const CLEAR_SESSION = 'CLEAR_SESSION';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const getOAuthToken = () => action(POST_SOCIAL_TOKEN);

export const getFinalToken = (oauth_verifier: string) =>
  action(GET_FINAL_TOKEN, {oauth_verifier});

export const logUserOut = () => action(LOGOUT);

export function* watchAuth(): any {
  // wrapping it in a for loop allows us to
  // pause or resume our auth workflow
  // info: https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html
  while (true) {
    // In our case we would want to send a post request
    // to osmcha as soon as possible. This prepares us for
    // the eventual login flow.
    try {
      const {oauth_token, oauth_token_secret} = yield call(postTokensOSMCha);
      yield put(
        action(SAVE_OAUTH_OBJ, {
          oauth_token,
          oauth_token_secret,
        }),
      );

      // yield take(ACTION) waits for the particular action
      // to emit and resume the flow. next in action would
      // be to wait for the action `GET_FINAL_TOKEN`
      // and resume the flow
      const {oauth_verifier} = yield take(GET_FINAL_TOKEN);
      const {token} = yield call(postTokensOSMCha, oauth_token, oauth_verifier);
      console.log('token', token);
      yield put(
        action(SAVE_TOKEN, {
          token,
          oauth_verifier,
        }),
      );
    } catch (error) {
      yield put({type: LOGIN_ERROR, error});
    }
    yield take([LOGOUT, LOGIN_ERROR]);
    yield put(action(CLEAR_SESSION));
    yield call(delay, 1000);
    console.log('cleared session, restarting');
  }
}
