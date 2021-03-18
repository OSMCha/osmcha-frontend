import { all, put, call, takeEvery, select } from 'redux-saga/effects';

import {
  postUserToTrustedList,
  deleteFromTrustedList
} from '../network/osmcha_trustedlist.js';
import { modal } from './modal_actions';

import type { RootStateType } from './';

export const TRUSTEDLIST = {
  define: 'TRUSTEDLIST.define',
  add: 'TRUSTEDLIST.add',
  remove: 'TRUSTEDLIST.remove',
  clear: 'TRUSTEDLIST.clear'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const addToTrustedlist = (trustedlist_user: string) =>
  action(TRUSTEDLIST.add, { trustedlist_user });

export const removeFromTrustedlist = (trustedlist_user: string) =>
  action(TRUSTEDLIST.remove, { trustedlist_user });

export function* watchTrustedlist(): any {
  yield all([
    takeEvery(TRUSTEDLIST.add, addToTrustedlistSaga),
    takeEvery(TRUSTEDLIST.remove, removeFromTrustedlistSaga)
  ]);
}

export function* addToTrustedlistSaga(trustedlist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(postUserToTrustedList, token, trustedlist_user.trustedlist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${trustedlist_user.trustedlist_user} added to your Trusted Users list.`,
        kind: 'success'
      })
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
}
export function* removeFromTrustedlistSaga(trustedlist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(deleteFromTrustedList, token, trustedlist_user.trustedlist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${trustedlist_user.trustedlist_user} removed from your Trusted Users list.`,
        kind: 'success'
      })
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
}
