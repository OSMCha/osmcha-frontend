// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {fromJS} from 'immutable';

import {fetchChangeset} from '../network/changeset';
import {getChangeset as getCMapData} from 'changeset-map';

import type {RootStateType} from './';

export const CHANGESET_FETCH_ASYNC = 'CHANGESET_FETCH_ASYNC';
export const CHANGESET_FETCHED = 'CHANGESET_FETCHED';
export const CHANGESET_CHANGE = 'CHANGESET_CHANGE';
export const CHANGESET_LOADING = 'CHANGESET_LOADING';
export const CHANGESET_ERROR = 'CHANGESET_ERROR';

export const CHANGESET_MAP_LOADING = 'CHANGESET_MAP_FETCH_LOADING';
export const CHANGESET_MAP_FETCHED = 'CHANGESET_MAP_FETCHED';
export const CHANGESET_MAP_ERROR = 'CHANGESET_MAP_ERROR';
export const CHANGESET_MAP_CHANGE = 'CHANGESET_MAP_CHANGE';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const getChangeset = (changesetId: number) =>
  action(CHANGESET_FETCH_ASYNC, {changesetId});

// watches for CHANGESET_FETCH_ASYNC and only
// dispatches latest tofetchChangesetsPageAsync
export function* watchFetchChangeset(): any {
  yield takeLatest(CHANGESET_FETCH_ASYNC, fetchChangesetAndChangesetMap);
}

/** Sagas **/
export function* fetchChangesetAndChangesetMap(
  {changesetId}: {changesetId: number},
): Object {
  // run both in parallel
  yield [
    call(fetchChangesetAsync, {changesetId}),
    call(fetchChangesetMapAsync, {changesetId}),
  ];
}

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
      let token = yield select((state: RootStateType) =>
        state.auth.get('token'));
      changeset = yield call(fetchChangeset, changesetId, token);
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
      changesetMap = yield call(getCMapData, changesetId);
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
