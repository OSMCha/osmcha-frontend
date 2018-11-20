import { all, put, call, takeEvery, select } from 'redux-saga/effects';

import {
  postUserToWhiteList,
  deleteFromWhiteList
} from '../network/osmcha_whitelist.js';
import { modal } from './modal_actions';

import type { RootStateType } from './';

export const WHITELIST = {
  define: 'WHITELIST.define',
  add: 'WHITELIST.add',
  remove: 'WHITELIST.remove',
  clear: 'WHITELIST.clear'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const addToWhitelist = (whitelist_user: string) =>
  action(WHITELIST.add, { whitelist_user });

export const removeFromWhitelist = (whitelist_user: string) =>
  action(WHITELIST.remove, { whitelist_user });

export function* watchWhitelist(): any {
  yield all([
    takeEvery(WHITELIST.add, addToWhitelistSaga),
    takeEvery(WHITELIST.remove, removeFromWhitelistSaga)
  ]);
}

export function* addToWhitelistSaga(whitelist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(postUserToWhiteList, token, whitelist_user.whitelist_user);
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
}
export function* removeFromWhitelistSaga(whitelist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(deleteFromWhiteList, token, whitelist_user.whitelist_user);
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
}
