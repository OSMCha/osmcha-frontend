// @flow
import {put, call, takeLatest, select} from 'redux-saga/effects';
import {API_URL} from '../config';

export const CHANGESETS_PAGE_FETCH_ASYNC = 'CHANGESETS_PAGE_FETCH_ASYNC';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_CHANGE = 'CHANGESETS_PAGE_CHANGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';

import {PAGE_SIZE} from '../config/constants';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
export const fetchChangesets = (pageIndex: number) =>
  action(CHANGESETS_PAGE_FETCH_ASYNC, {pageIndex});

export function* watchFetchChangesets(): any {
  yield takeLatest(CHANGESETS_PAGE_FETCH_ASYNC, fetchChangesetsPageAsync);
}

export function networkCall(pageIndex: number) {
  return fetch(
    `${API_URL}/changesets?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`,
  ).then(res => res.json());
}

/** Sagas **/
export function* fetchChangesetsPageAsync(
  {pageIndex = 0}: {pageIndex: number},
): Object {
  // check if it already exists
  let thisPage = yield select(state =>
    state.changesets.get('pages').get(pageIndex));

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
      thisPage = yield call(networkCall, pageIndex);
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
