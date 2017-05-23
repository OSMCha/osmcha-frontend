// @flow
import {put, call, take, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {postTokensOSMCha} from '../network/auth';
import * as safeStorage from '../utils/safe_storage';

import type {RootStateType} from './';

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
  // get the token from localStorage.
  // if it exists we just need to wait for
  // logout action.
  let localToken = yield select((state: RootStateType) =>
    state.auth.get('token'));

  // wrapping it in a for loop allows us to
  // pause or resume our auth workflow
  // info: https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html
  while (true) {
    try {
      if (!localToken) {
        const {oauth_token, oauth_token_secret} = yield call(postTokensOSMCha);
        yield put(
          action(SAVE_OAUTH_OBJ, {
            oauth_token,
            oauth_token_secret,
          }),
        );
        console.log('oauth_token', oauth_token);
        // yield take(ACTION) waits for the particular action
        // to emit and resume the flow. next in action would
        // be to wait for the action `GET_FINAL_TOKEN`
        // and resume the flow
        const {oauth_verifier} = yield take(GET_FINAL_TOKEN);
        const {token} = yield call(
          postTokensOSMCha,
          oauth_token,
          oauth_verifier,
        );

        if (!token || token === '') {
          throw new Error('invalid token');
        }

        console.log('token', token);
        safeStorage.setItem('token', token);
        safeStorage.setItem('oauth_token', oauth_token);
        safeStorage.setItem('oauth_token_secret', oauth_token_secret);
        yield put(
          action(SAVE_TOKEN, {
            token,
            oauth_verifier,
          }),
        );
      }
      yield take(LOGOUT);
    } catch (error) {
      yield put(action(LOGIN_ERROR, error));
      yield call(delay, 1000);
    } finally {
      yield put(action(CLEAR_SESSION));
      safeStorage.removeItem('token');
      safeStorage.removeItem('oauth_token');
      safeStorage.removeItem('oauth_token_secret');
    }
  }
}
