// @flow
import { put, call, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromJS } from 'immutable';

import {
  postTokensOSMCha,
  postFinalTokensOSMCha,
  fetchUserDetails
} from '../network/auth';
import { setItem, removeItem } from '../utils/safe_storage';

import { modal } from './modal_actions';

import type { RootStateType } from './';

export const AUTH = {
  postSocialToken: 'AUTH_POST_SOCIAL_TOKEN',
  saveOAuth: 'AUTH_SAVE_OAUTH_OBJ',
  getFinalToken: 'AUTH_GET_FINAL_TOKEN',
  saveToken: 'AUTH_SAVE_TOKEN',
  logout: 'AUTH_LOGOUT',
  clearSession: 'AUTH_CLEAR_SESSION',
  loginError: 'AUTH_LOGIN_ERROR',
  userDetails: 'AUTH_USER_DETAILS'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getOAuthToken = () => action(AUTH.postSocialToken);

export const getFinalToken = (oauth_verifier: string) =>
  action(AUTH.getFinalToken, { oauth_verifier });

export const logUserOut = () => action(AUTH.logout);

export const getTokenSelector = (state: RootStateType) =>
  state.auth.get('token');
export function* watchAuth(): any {
  // get the token from localStorage.
  // if it exists we just need to wait for
  // logout action.
  let DELAY = 1000;
  let token = yield select(getTokenSelector);
  // wrapping it in a for loop allows us to
  // pause or resume our auth workflow
  // info: https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html
  while (true) {
    try {
      if (!token) {
        token = yield call(authTokenFlow);
      }
      const userDetails = fromJS(yield call(fetchUserDetails, token));
      yield put(action(AUTH.userDetails, { userDetails }));

      yield take(AUTH.logout);
      DELAY = 1000;
    } catch (error) {
      yield put(action(AUTH.loginError, error));
      yield call(delay, 500);
      error.name = 'Login Failed';
      yield put(
        modal({
          error,
          kind: 'warning'
        })
      );
      DELAY = 4 * DELAY;
    } finally {
      token = undefined;
      yield call(removeItem, 'token');
      yield call(removeItem, 'oauth_token');
      yield call(removeItem, 'oauth_token_secret');
      yield put(action(AUTH.clearSession));
      yield call(delay, DELAY);
    }
  }
}

export function* authTokenFlow(): any {
  const { oauth_token, oauth_token_secret } = yield call(postTokensOSMCha);
  yield put(
    action(AUTH.saveOAuth, {
      oauth_token,
      oauth_token_secret
    })
  );
  // yield take(ACTION) waits for the particular action
  // to emit and resume the flow. next in action would
  // be to wait for the action `GET_FINAL_TOKEN`
  // and resume the flow
  const { oauth_verifier } = yield take(AUTH.getFinalToken);
  const { token } = yield call(
    postFinalTokensOSMCha,
    oauth_token,
    oauth_token_secret,
    oauth_verifier
  );
  if (!token || token === '') {
    throw new Error('invalid token');
  }
  yield call(setItem, 'token', token);
  yield call(setItem, 'oauth_token', oauth_token);
  yield call(setItem, 'oauth_token_secret', oauth_token_secret);
  yield put(
    action(AUTH.saveToken, {
      token,
      oauth_verifier
    })
  );
  return token;
}
