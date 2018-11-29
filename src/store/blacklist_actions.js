import { all, put, call, takeEvery, select } from 'redux-saga/effects';

import {
  postUserToBlackList,
  deleteFromBlackList
} from '../network/osmcha_blacklist.js';
import { modal } from './modal_actions';

import type { RootStateType } from './';

export const BLACKLIST = {
  define: 'BLACKLIST.define',
  add: 'BLACKLIST.add',
  remove: 'BLACKLIST.remove',
  clear: 'BLACKLIST.clear'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const addToBlacklist = (blacklist_user: string, uid: string) =>
  action(BLACKLIST.add, { blacklist_user, uid });

export const removeFromBlacklist = (blacklist_user: string) =>
  action(BLACKLIST.remove, { blacklist_user });

export function* watchBlacklist(): any {
  yield all([
    takeEvery(BLACKLIST.add, addToBlacklistSaga),
    takeEvery(BLACKLIST.remove, removeFromBlacklistSaga)
  ]);
}

export function* addToBlacklistSaga(blacklist_user: object): any {
  try {
    const token = yield select(tokenSelector);
    yield call(postUserToBlackList, token, blacklist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${blacklist_user.blacklist_user.username} (${
          blacklist_user.blacklist_user.uid
        }) added to your watchlist.`,
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
export function* removeFromBlacklistSaga(blacklist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(deleteFromBlackList, token, blacklist_user.blacklist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${
          blacklist_user.blacklist_user
        } removed from your watchlist.`,
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
