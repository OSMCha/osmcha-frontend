// @flow
import {delay} from 'redux-saga';
import {put, takeEvery} from 'redux-saga/effects';

export const CHANGESETS_FETCH_ASYNC = 'CHANGESETS_FETCH_ASYNC';
export const CHANGESETS_FETCHED = 'CHANGESETS_FETCHED';

type Payload = {
  data?: Object,
};

export function action(type: string, payload: Payload = {}) {
  return {type, ...payload};
}

export const fetchChangesets = () => action(CHANGESETS_FETCH_ASYNC);

/** Sagas **/
export function* fetchChangesetsAsync(): Object {
  yield delay(6000);
  yield put({type: CHANGESETS_FETCHED, data: 2});
}

export function* watchFetchChangesets(): any {
  yield takeEvery(CHANGESETS_FETCH_ASYNC, fetchChangesetsAsync);
}
