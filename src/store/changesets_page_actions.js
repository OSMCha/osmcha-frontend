// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {networkFetchChangesets} from '../network/changesets_page';

export const CHANGESETS_PAGE_FETCH_ASYNC = 'CHANGESETS_PAGE_FETCH_ASYNC';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_CHANGE = 'CHANGESETS_PAGE_CHANGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';

import type {RootStateType} from './';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const fetchChangesets = (pageIndex: number) =>
  action(CHANGESETS_PAGE_FETCH_ASYNC, {pageIndex});

// watches for CHANGESETS_PAGE_FETCH_ASYNC and only
// dispatches latest tofetchChangesetsPageAsync
export function* watchFetchChangesets(): any {
  yield takeLatest(CHANGESETS_PAGE_FETCH_ASYNC, fetchChangesetsPageAsync);
}

/** Sagas **/
export function* fetchChangesetsPageAsync(
  {pageIndex}: {pageIndex: number},
): Object {
  // check if the page already exists
  let thisPage = yield select((state: RootStateType) =>
    state.changesetsPage.get('pages').get(pageIndex));

  if (thisPage) {
    yield put(
      action(CHANGESETS_PAGE_CHANGE, {
        pageIndex,
      }),
    );
  } else {
    yield put(
      action(CHANGESETS_PAGE_LOADING, {
        pageIndex,
      }),
    );

    try {
      thisPage = yield call(networkFetchChangesets, pageIndex);
      yield put(
        action(CHANGESETS_PAGE_FETCHED, {
          data: thisPage,
          pageIndex,
        }),
      );
    } catch (error) {
      console.log(error);
      yield put(
        action(CHANGESETS_PAGE_ERROR, {
          pageIndex,
          error,
        }),
      );
    }
  }
}
