// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {fromJS} from 'immutable';

import {fetchChangesetsPage} from '../network/changesets_page';

import type {RootStateType} from './';

export const CHANGESETS_PAGE_FETCH_ASYNC = 'CHANGESETS_PAGE_FETCH_ASYNC';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_CHANGE = 'CHANGESETS_PAGE_CHANGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number) =>
  action(CHANGESETS_PAGE_FETCH_ASYNC, {pageIndex});

// watches for CHANGESETS_PAGE_FETCH_ASYNC and only
// dispatches latest to fetchChangesetsPageAsync
export function* watchFetchChangesetsPage(): any {
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
      thisPage = yield call(fetchChangesetsPage, pageIndex);
      yield put(
        action(CHANGESETS_PAGE_FETCHED, {
          data: fromJS(thisPage),
          pageIndex,
        }),
      );
    } catch (error) {
      console.log(error.stack);
      yield put(
        action(CHANGESETS_PAGE_ERROR, {
          pageIndex,
          error,
        }),
      );
    }
  }
}
