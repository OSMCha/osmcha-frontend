import { all, put, call, takeEvery, select } from 'redux-saga/effects';

import {
  postUserToWatchList,
  deleteFromWatchList
} from '../network/osmcha_watchlist';
import { modal } from './modal_actions';

import type { RootStateType } from './';

export const WATCHLIST = {
  define: 'WATCHLIST.define',
  add: 'WATCHLIST.add',
  remove: 'WATCHLIST.remove',
  clear: 'WATCHLIST.clear'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const addToWatchlist = (watchlist_user: string, uid: string) =>
  action(WATCHLIST.add, { watchlist_user, uid });

export const removeFromWatchlist = (watchlist_user: string) =>
  action(WATCHLIST.remove, { watchlist_user });

export function* watchWatchlist(): any {
  yield all([
    takeEvery(WATCHLIST.add, addToWatchlistSaga),
    takeEvery(WATCHLIST.remove, removeFromWatchlistSaga)
  ]);
}

export function* addToWatchlistSaga(watchlist_user: object): any {
  try {
    const token = yield select(tokenSelector);
    yield call(postUserToWatchList, token, watchlist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${watchlist_user.watchlist_user.username} (${watchlist_user.watchlist_user.uid}) added to your watchlist.`,
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
export function* removeFromWatchlistSaga(watchlist_user: string): any {
  try {
    const token = yield select(tokenSelector);
    yield call(deleteFromWatchList, token, watchlist_user.watchlist_user);
    yield put(
      modal({
        title: 'Success',
        description: `User ${watchlist_user.watchlist_user} removed from your watchlist.`,
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
