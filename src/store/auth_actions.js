// @flow
import {put, call, takeLatest, take, select} from 'redux-saga/effects';

import {postTokensOSMCha} from '../network/auth';

export const POST_SOCIAL_TOKEN = 'POST_SOCIAL_TOKEN';
export const SAVE_OSMCHA_OAUTH_OBJ = 'SAVE_OSMCHA_OAUTH_OBJ';
export const GET_FINAL_TOKEN = 'GET_FINAL_TOKEN';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const initOSMChaOAuthToken = () => action(POST_SOCIAL_TOKEN);
export const initFinalToken = (oAuthObj: Object) =>
  action(GET_FINAL_TOKEN, {oAuthObj});

export function* watchAuth(): any {
  while (true) {
    console.log('here 1');
    yield take(POST_SOCIAL_TOKEN);
    yield call(postSocialToken);
    const {oAuthObj} = yield take(GET_FINAL_TOKEN);
    console.log('here 3', oAuthObj);
    yield call(getFinalToken, {oAuthObj});
    console.log('here 4', oAuthObj);
  }
}

function* postSocialToken() {
  console.log('here postsocialtoken');
  var oAuthObj = yield call(postTokensOSMCha);
  yield put(
    action(SAVE_OSMCHA_OAUTH_OBJ, {
      oAuthObj,
    }),
  );
}

function* getFinalToken({oAuthObj}: Object) {
  var token = yield call(postTokensOSMCha, {oAuthObj});
  console.log(token);
}
