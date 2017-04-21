// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {networkFetchChangeset} from '../network/changeset';
import {networkFetchChangesetMap} from '../network/real_changeset';

export const CHANGESET_FETCH_ASYNC = 'CHANGESET_FETCH_ASYNC';
export const CHANGESET_FETCHED = 'CHANGESET_FETCHED';
export const CHANGESET_CHANGE = 'CHANGESET_CHANGE';
export const CHANGESET_LOADING = 'CHANGESET_LOADING';
export const CHANGESET_ERROR = 'CHANGESET_ERROR';

export const CHANGESET_MAP_FETCH_ASYNC = 'CHANGESET_MAP_FETCH_ASYNC';
export const CHANGESET_MAP_LOADING = 'CHANGESET_MAP_FETCH_LOADING';
export const CHANGESET_MAP_FETCHED = 'CHANGESET_MAP_FETCHED';
export const CHANGESET_MAP_ERROR = 'CHANGESET_MAP_ERROR';
export const CHANGESET_MAP_CHANGE = 'CHANGESET_MAP_CHANGE';
export const CHANGESET_MAP_RESET = 'CHANGESET_MAP_RESET';

import {fromJS} from 'immutable';
import type {RootStateType} from './';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const fetchChangeset = (changesetId: number) =>
  action(CHANGESET_FETCH_ASYNC, {changesetId});

export const fetchChangesetMap = (changesetId: number) =>
  action(CHANGESET_MAP_FETCH_ASYNC, {changesetId});

// watches for CHANGESET_FETCH_ASYNC and only
// dispatches latest tofetchChangesetsPageAsync
export function* watchFetchChangeset(): any {
  yield takeLatest(CHANGESET_FETCH_ASYNC, fetchChangesetAsync);
}

export function* watchFetchChangesetMap(): any {
  yield takeLatest(CHANGESET_MAP_FETCH_ASYNC, fetchChangesetMapAsync);
}

/** Sagas **/
export function* fetchChangesetAsync(
  {changesetId}: {changesetId: number},
): Object {
  // check if the changeset already exists
  let changeset = yield select((state: RootStateType) =>
    state.changeset.get('changesets').get(changesetId));

  if (changeset) {
    yield put(
      action(CHANGESET_CHANGE, {
        changesetId,
      }),
    );
  } else {
    yield put(
      action(CHANGESET_LOADING, {
        changesetId,
      }),
    );

    try {
      changeset = yield call(networkFetchChangeset, changesetId);
      yield put(
        action(CHANGESET_FETCHED, {
          data: fromJS(changeset),
          changesetId,
        }),
      );
    } catch (error) {
      console.error(error);
      yield put(
        action(CHANGESET_ERROR, {
          changesetId,
          error,
        }),
      );
    }
  }
}

export function* fetchChangesetMapAsync(
  {changesetId}: {changesetId: number},
): Object {
  yield put(action(CHANGESET_MAP_RESET));
  yield delay(100);
  let changesetMap = yield select((state: RootStateType) =>
    state.changeset.get('changesetMap').get(changesetId));
  if (changesetMap) {
    yield put(
      action(CHANGESET_MAP_CHANGE, {
        changesetId,
      }),
    );
  } else {
    try {
      changesetMap = yield call(networkFetchChangesetMap, changesetId);
      yield put(
        action(CHANGESET_MAP_FETCHED, {
          data: changesetMap,
          changesetId,
        }),
      );
    } catch (error) {
      console.error(error);
      yield put(
        action(CHANGESET_MAP_ERROR, {
          changesetId,
          error,
        }),
      );
    }
  }
}
