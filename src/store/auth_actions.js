// @flow
import { put, call, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromJS } from 'immutable';

import {
  postTokensOSMCha,
  fetchUserDetails as fetchOsmchaUserDetails
} from '../network/auth';
import { setItem, removeItem } from '../utils/safe_storage';
import { getUserDetails as fetchOsmUserDetails } from '../network/openstreetmap';

import { modal } from './modal_actions';

import type { RootStateType } from './';

export const POST_SOCIAL_TOKEN = 'POST_SOCIAL_TOKEN';
export const SAVE_OAUTH_OBJ = 'SAVE_OAUTH_OBJ';
export const GET_FINAL_TOKEN = 'GET_FINAL_TOKEN';
export const SAVE_TOKEN = 'SAVE_TOKEN';
export const LOGOUT = 'LOGOUT';
export const CLEAR_SESSION = 'CLEAR_SESSION';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const USER_DETAILS = 'USER_DETAILS';

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getOAuthToken = () => action(POST_SOCIAL_TOKEN);

export const getFinalToken = (oauth_verifier: string) =>
  action(GET_FINAL_TOKEN, { oauth_verifier });

export const logUserOut = () => action(LOGOUT);

export function* watchAuth(): any {
  // get the token from localStorage.
  // if it exists we just need to wait for
  // logout action.
  let DELAY = 1000;
  let token = yield select((state: RootStateType) => state.auth.get('token'));

  // wrapping it in a for loop allows us to
  // pause or resume our auth workflow
  // info: https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html
  while (true) {
    try {
      if (!token) {
        token = yield call(authTokenFlow);
      }
      const userDetails = fromJS(yield call(fetchOsmchaUserDetails, token));
      // const osmUser = yield call(fetchOsmUserDetails, userDetails.get('id'));
      // console.log(osmUser);
      yield put(action(USER_DETAILS, { userDetails }));
      DELAY = 1000;
      yield take(LOGOUT);
    } catch (error) {
      yield put(action(LOGIN_ERROR, error));
      yield call(delay, 500);
      error.name = 'Login Failed';
      yield put(
        modal({
          error,
          kind: 'warning'
        })
      );
      DELAY = 2 * DELAY;
    } finally {
      token = undefined;
      yield call(removeItem, 'token');
      yield call(removeItem, 'oauth_token');
      yield call(removeItem, 'oauth_token_secret');
      yield call(delay, DELAY);
      yield put(action(CLEAR_SESSION));
    }
  }
}

export function* authTokenFlow(): any {
  const { oauth_token, oauth_token_secret } = yield call(postTokensOSMCha);
  yield put(
    action(SAVE_OAUTH_OBJ, {
      oauth_token,
      oauth_token_secret
    })
  );
  // yield take(ACTION) waits for the particular action
  // to emit and resume the flow. next in action would
  // be to wait for the action `GET_FINAL_TOKEN`
  // and resume the flow
  const { oauth_verifier } = yield take(GET_FINAL_TOKEN);
  const { token } = yield call(
    postTokensOSMCha,
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
    action(SAVE_TOKEN, {
      token,
      oauth_verifier
    })
  );
  return token;
}
