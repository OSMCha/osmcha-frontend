// @flow
import { put, call, take, select, all, takeLatest } from 'redux-saga/effects';
import { delay as delayPromise } from 'redux-saga';
import { fromJS } from 'immutable';

import {
  postTokensOSMCha,
  postFinalTokensOSMCha,
  fetchUserDetails,
  updateUserDetails
} from '../network/auth';
import { setItem, removeItem } from '../utils/safe_storage';
import notifications from '../config/notifications';

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
  userDetails: 'AUTH_USER_DETAILS',
  updateUserDetails: 'UPDATE_USER_DETAILS'
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

export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const newsAlertSelector = (state: RootStateType) =>
  state.auth.get('newsAlertShowCount');

const delay = process.env.NODE_ENV === 'test' ? () => {} : delayPromise;
const DELAY = 1000;

export const applyUpdateUserDetails = (
  message_good: string,
  message_bad: string,
  comment_feature: boolean
) => action(AUTH.updateUserDetails, {message_good, message_bad, comment_feature});

export function* watchUserDetails(): any {
  yield all([
    takeLatest(AUTH.updateUserDetails, updateUserDetailsSaga)
  ]);
}

export function* watchAuth(): any {
  // get the token from localStorage.
  // if it exists we just need to wait for
  // logout action.
  let delayBy = 1000;
  let token = yield select(tokenSelector);
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

      // changeset comment alert
      // it will be removed after this feature is well known by the OSM community
      let newsAlertShowCount = yield select(newsAlertSelector);
      if (newsAlertShowCount == null) {
        newsAlertShowCount = 0;
      }
      if (newsAlertShowCount < 4) {
        yield put(
          modal({
            ...notifications.NEWS
          })
        );
        yield call(
          setItem,
          'news_alert_show_count',
          Math.ceil(newsAlertShowCount) + 1
        );
      }

      yield take(AUTH.logout);
      delayBy = DELAY;
    } catch (error) {
      yield put(action(AUTH.loginError, error));
      yield call(delay, delayBy / 2);
      error.name = 'Login Failed';
      yield put(
        modal({
          error,
          kind: 'warning'
        })
      );
      delayBy = 4 * delayBy;
    } finally {
      token = undefined;
      yield call(removeItem, 'token');
      yield call(removeItem, 'oauth_token');
      yield call(removeItem, 'oauth_token_secret');
      yield put(action(AUTH.clearSession));
      yield call(delay, delayBy);
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

export function* updateUserDetailsSaga({
    message_good,
    message_bad,
    comment_feature
  }: {
    message_good: string,
    message_bad: string,
    comment_feature: boolean
  }): any {
    try {
      let token = yield select(tokenSelector);
      if (token) {
        const userDetails = fromJS(
          yield call(updateUserDetails, token, message_good, message_bad, comment_feature)
        );
        yield put(action(AUTH.userDetails, { userDetails }));
        yield put(
          modal({
            kind: 'success',
            title: 'User updated',
            description: 'Your user preferences were updated successfully'
          })
        );
      }
    } catch (e) {
      console.error(e);
      yield put(
        modal({
          error: e
        })
      );
    }
}
