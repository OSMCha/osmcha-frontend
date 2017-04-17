// @flow
import {put, takeEvery} from 'redux-saga/effects';
import {API_URL} from '../config';
export const CHANGESETS_FETCH_ASYNC = 'CHANGESETS_FETCH_ASYNC';
export const CHANGESETS_FETCHED = 'CHANGESETS_FETCHED';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

export const fetchChangesets = (page: number) =>
  action(CHANGESETS_FETCH_ASYNC, {page});

/** Sagas **/
export function* fetchChangesetsAsync({page = 1}: {page: number}): Object {
  var data = yield fetch(`${API_URL}/changesets?page=${page}`).then(res =>
    res.json());

  yield put(
    action(CHANGESETS_FETCHED, {
      data: data,
      page: page,
    }),
  );
}

export function* watchFetchChangesets(): any {
  yield takeEvery(CHANGESETS_FETCH_ASYNC, fetchChangesetsAsync);
}
