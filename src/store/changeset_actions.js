// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {networkFetchChangeset} from '../network/changeset';

export const CHANGESET_FETCH_ASYNC = 'CHANGESET_FETCH_ASYNC';
export const CHANGESET_FETCHED = 'CHANGESET_FETCHED';
export const CHANGESET_CHANGE = 'CHANGESET_CHANGE';
export const CHANGESET_LOADING = 'CHANGESET_LOADING';
export const CHANGESET_ERROR = 'CHANGESET_ERROR';

import type {RootStateType} from './';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const fetchChangeset = (changesetId: number) =>
  action(CHANGESET_FETCH_ASYNC, {changesetId});

// watches for CHANGESET_FETCH_ASYNC and only
// dispatches latest tofetchChangesetsPageAsync
export function* watchFetchChangeset(): any {
  yield takeLatest(CHANGESET_FETCH_ASYNC, fetchChangesetAsync);
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
          data: changeset,
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
